import { GameEngine } from './engine.mjs';
import { encodeMsg, decodeMsg } from './pb.mjs';
import { RiichiMsg, PlayAction, ManType, YiType, LiuJuType } from './proto_enum.mjs';
import { tileName, decodeId, tileId } from './tiles.mjs';

var MSG_NAME = {
  1: "ReqPrepare",
  2: "RspPrepare",
  3: "ReqPlayCard",
  4: "RspPlayCard",
  5: "ReqQiangCard",
  6: "RspQiangCard",
  7: "ReqSetInternalState",
  8: "RspSetInternalState",
  9: "ReqCloseOfflineTip",
  10: "RspCloseOfflineTip",
  11: "ReqClickUI",
  12: "RspClickUI",
  1001: "NtfToPrepare",
  1002: "NtfPrepare",
  1003: "NtfGameStart",
  1004: "NtfSendCard",
  1005: "NtfPlayCard",
  1006: "NtfQiangCard",
  1007: "NtfQiangCardEnd",
  1008: "NtfGameStop",
  1009: "NtfOfflineToolTip"
};
var RiichiSession = class {
  constructor(opts = {}) {
    this.opts = {
      players: opts.players != null ? opts.players : 4,
      akaCount: opts.akaCount != null ? opts.akaCount : 1,
      startScore: opts.startScore != null ? opts.startScore : opts.players === 3 ? 35e3 : 25e3,
      matchLength: opts.matchLength === "hanchan" ? "hanchan" : "east",
      maxHands: opts.maxHands != null ? opts.maxHands : opts.matchLength === "hanchan" ? 64 : 32,
      // AI 思考延迟倍率。0 = 瞬间（自测用），1 = 正常观感
      speed: opts.speed != null ? opts.speed : 1,
      seed: opts.seed,
      baseTime: opts.baseTime != null ? opts.baseTime : 5,
      extraTime: opts.extraTime != null ? opts.extraTime : 20,
      internalState: { ...(opts.internalState || {}) },
      autoHuman: opts.autoHuman != null ? opts.autoHuman : false,
      // 座位 -> 真实 userID，必须与 20408/20014 下发的牌桌 uid 完全一致
      uids: opts.uids || null
    };
    this.onFrame = opts.onFrame || (() => {
    });
    this.onFinish = opts.onFinish || (() => {
    });
    this.onFinalResult = opts.onFinalResult || (() => null);
    this.onSettingsChange = opts.onSettingsChange || (() => {
    });
    this.log = opts.log || (() => {
    });
    // 存档/上一场缓存没有通过开局协议同步到 Unity，不能作为当前 UI 的自动操作授权。
    // 仅本次客户端 ReqSetInternalState 明确提交的项可用于自动和牌/不鸣/摸切。
    this.clientInternalState = {};
    this.engine = null;
    this.stopped = false;
    this.matchOver = false;
  }
  /** 新连接尚未同步自动操作开关，不得继承旧页面的授权；不改存档或计时。 */
  resetClientSettings() {
    this.clientInternalState = {};
    if (this.engine) this.engine.setInternalState({ 1: false, 2: false, 3: false, 4: false, 5: false });
  }
  /** 编码并回推一个服务端事件 */
  send(ev, payload) {
    if (this.stopped) return;
    const name = MSG_NAME[ev];
    if (!name) {
      this.log("[riichi] \u672A\u77E5\u4E8B\u4EF6\u53F7 " + ev);
      return;
    }
    let bytes;
    try {
      bytes = encodeMsg(name, payload);
    } catch (e) {
      this.log("[riichi] \u7F16\u7801\u5931\u8D25 " + name + ": " + e.message);
      return;
    }
    this.onFrame(ev, bytes);
  }
  /** 惰性创建引擎。一场（东风战）打完 = 本会话结束：引擎停、matchOver 置位，
   *  之后【绝不】在同一会话里重建引擎——新一场必须由客户端重新走 20403 匹配，
   *  server.js 的 20403 handler 会 stop 旧 session 并 new 一个新的 RiichiSession。 */
  ensureEngine() {
    if (this.matchOver) return null;
    if (this.engine) return this.engine;
    const o = this.opts;
    const seed = o.seed != null ? o.seed : Math.random() * 2147483647 | 0;
    const eng = new GameEngine({
      players: o.players,
      akaCount: o.akaCount,
      startScore: o.startScore,
      matchLength: o.matchLength,
      maxHands: o.maxHands,
      speed: o.speed,
      seed,
      baseTime: o.baseTime,
      extraTime: o.extraTime,
      internalState: this.clientInternalState,
      uids: o.uids,
      autoHuman: o.autoHuman,
      onFinalResult: (scores, engine) => this.onFinalResult(scores, engine),
      // false=0号位真人，true=AI代打（测试用）
      emit: (ev, payload) => this.send(ev, payload),
      onFinish: (scores) => {
        this.matchOver = true;
        this.onFinish(scores.slice(), eng);
        this.log("[riichi] 终局，引擎停止；等客户端 20102 收场或 20403 重新匹配");
      }
    });
    this.engine = eng;
    this.log("[riichi] \u65B0\u5BF9\u5C40 players=" + o.players + " seed=" + seed + " maxHands=" + o.maxHands);
    eng.start().catch((e) => this.log("[riichi] \u5F15\u64CE\u5F02\u5E38: " + (e && e.stack || e)));
    return eng;
  }
  /** 处理一条客户端上行的内层消息 */
  handleClient(msgType, innerBytes) {
    if (this.matchOver) {
      if (!this._mutedLogged) {
        this._mutedLogged = true;
        this.log("[riichi] \u7EC8\u5C40\u540E\u5FFD\u7565\u5BA2\u6237\u7AEF\u4E0A\u884C\uFF08\u5BF9\u9F50\u771F\u5B9E\u670D\uFF1A\u96F6\u54CD\u5E94\uFF09\uFF0C\u7B49 20102/20403");
      }
      return;
    }
    const name = MSG_NAME[msgType];
    let payload = {};
    if (name && innerBytes && innerBytes.length) {
      try {
        payload = decodeMsg(name, innerBytes);
      } catch (e) {
        this.log("[riichi] \u89E3\u7801\u5931\u8D25 mt=" + msgType + ": " + e.message);
      }
    }
    switch (msgType) {
      case RiichiMsg.EReqPrepare: {
        const e = this.ensureEngine();
        if (!e) return;
        this.send(RiichiMsg.ERspPrepare, { result: 0 });
        e.submitPrepare();
        break;
      }
      case RiichiMsg.EReqPlayCard: {
        const e = this.ensureEngine();
        if (!e) return;
        const result = e.submitDraw(payload);
        this.send(RiichiMsg.ERspPlayCard, { result });
        break;
      }
      case RiichiMsg.EReqQiangCard: {
        const e = this.ensureEngine();
        if (!e) return;
        const result = e.submitClaim(payload);
        this.send(RiichiMsg.ERspQiangCard, { result });
        break;
      }
      case RiichiMsg.EReqSetInternalState: {
        const values = payload.InternalState || payload.internalState || {};
        this.opts.internalState = { ...this.opts.internalState, ...values };
        this.clientInternalState = { ...this.clientInternalState, ...values };
        if (this.engine) this.engine.setInternalState(values);
        this.onSettingsChange({ ...this.opts.internalState });
        this.send(RiichiMsg.ERspSetInternalState, { result: 0 });
        break;
      }
      case RiichiMsg.EReqCloseOfflineTip:
        this.send(RiichiMsg.ERspCloseOfflineTip, { result: 0 });
        break;
      case RiichiMsg.EReqClickUI:
        this.send(RiichiMsg.ERspClickUI, { result: 0 });
        break;
      default:
        this.log("[riichi] \u672A\u5904\u7406\u7684\u5BA2\u6237\u7AEF\u6D88\u606F mt=" + msgType);
    }
  }
  /** 连接断开：让引擎自然停下并不再回推 */
  stop() {
    this.stopped = true;
    const eng = this.engine;
    this.engine = null;
    if (!eng) return;
    eng.emit = () => {
    };
    eng.finished = true;
    eng.handEnded = true;
    try {
      eng.submitPrepare();
    } catch (e) {
    }
    try {
      eng.cancelPending();
    } catch (e) {
    }
  }
};
var _g = typeof window !== "undefined" ? window : globalThis;
var _MJ = _g.__mj || (_g.__mj = {});
_MJ.riichi = {
  RiichiSession,
  GameEngine,
  MSG_NAME,
  encodeMsg,
  decodeMsg,
  RiichiMsg,
  PlayAction,
  ManType,
  LiuJuType,
  YiType,
  tileName,
  decodeId,
  tileId
};

export { RiichiSession, GameEngine, MSG_NAME, encodeMsg, decodeMsg, RiichiMsg, PlayAction, ManType, LiuJuType, YiType, tileName, decodeId, tileId };
