import { SichuanSession } from './sichuan_session.mjs';
import { SichuanNotifications } from './sichuan_notifications.mjs';
import { handleSichuanRequest } from './sichuan_requests.mjs';
import { SICHUAN_CATALOG } from './sichuan_catalog.mjs';
import { MaJiangMsg as Msg, MaJiangResult as Result, decodeMaJiangEnvelope,
  encodeMaJiangEnvelope } from './majiang_pb.mjs';

// 只有血战（5022）有权威局序；血流/红中仍需独立规则实现，不能借用血战引擎。
export const SICHUAN_PLAYABLE_GAME_TYPES = Object.freeze([5022]);
const SCORE_TYPE_MONEY = 1; // 原 ScoreType_Score / ScoreType_Money 的第二项。
const REPLY_CACHE = 64;

/** 按原 MatchSeparateCfgTb 的房间 Id 取规则；不存在或未实现的玩法返回 null。 */
export function sichuanRoom(gameType, roomId) {
  const game = SICHUAN_CATALOG.games[String(gameType)];
  if (!game) return null;
  const room = game.rooms.find((item) => item.id === roomId);
  return room ? structuredClone(room) : null;
}

export function defaultSichuanRoom(gameType) {
  const game = SICHUAN_CATALOG.games[String(gameType)];
  const room = game?.rooms.find((item) => item.moneyCost > 0 && !item.ruleTags.includes(1));
  return room ? structuredClone(room) : null;
}

/** 房间标签1是“不换三张”；原表中不换牌房间均为256倍封顶。 */
export function sichuanRoomRules(room) {
  const exchange = !room.ruleTags.includes(1);
  return { exchange, topBei: room.topBei === 128 && exchange ? 128 : 256, baseScore: room.moneyBase };
}

/**
 * 四川一桌的传输适配：会话、下行投影、上行裁决和RPC去重组合在一起。
 * 只向 onFrame 交付已编码 majiang 信封，外层负责 20018 封装、缓存与重放。
 * 只结算一次，余额由外层按 onSettle 的 delta 写钱包；不写日麻段位/战绩。
 */
export class SichuanTable {
  #session;
  #notifications;
  #onFrame;
  #onSettle;
  #log;
  #replies = new Map();
  #buffer = null;
  #settled = false;
  #failed = false;
  #exited = false;

  constructor({ room, seed, userIds, initialScores, gameID, aiDelayMs = 350, timeoutsMs = {}, clock,
    onFrame, onSettle = () => {}, log = () => {} }) {
    if (!SICHUAN_PLAYABLE_GAME_TYPES.includes(room?.gameType)) throw new RangeError('尚未实现的四川玩法');
    if (typeof onFrame !== 'function' || typeof onSettle !== 'function') throw new TypeError('无效的四川牌桌回调');
    this.#onFrame = onFrame;
    this.#onSettle = onSettle;
    this.#log = log;
    this.room = structuredClone(room);
    this.#session = new SichuanSession({ seed: seed >>> 0, ...sichuanRoomRules(room), aiDelayMs, timeoutsMs, clock,
      onUpdate: () => this.#flush(),
      onFinish: (result) => this.#settle(result.scores[0], 'finish'),
      onError: (error) => this.#fail(error) });
    this.#notifications = new SichuanNotifications(this.#session,
      { gameID, userIds, initialScores, scoreType: SCORE_TYPE_MONEY });
  }

  get matchOver() { return this.#settled || this.#failed || this.#session.matchOver || this.#session.stopped; }
  get session() { return this.#session; }

  start() { return this.#session.start(); }

  #flush() {
    if (this.#failed) return;
    let frames;
    try { frames = this.#notifications.read(); } catch (error) { this.#fail(error); return; }
    for (const frame of frames) {
      if (this.#buffer) this.#buffer.push(frame);
      else this.#onFrame(frame.cmd, frame.bytes);
    }
  }

  #fail(error) {
    if (this.#failed) return;
    this.#failed = true;
    this.#log(`[sichuan] 牌局异常终止：${error?.message ?? error}`);
    this.#session.stop();
  }

  #settle(delta, reason) {
    if (this.#settled || this.#failed) return;
    this.#settled = true;
    this.#onSettle({ delta, reason, room: this.room, result: this.#session.result });
  }

  /** 上行入口。seq 来自外层可信请求序号；同号同包返回缓存，异包拒绝。 */
  handleClient(bytes, seq = 0) {
    const key = seq ? `${this.#session.view().connectionId}:${seq}` : null;
    const signature = Array.from(bytes).join(',');
    if (key && this.#replies.has(key)) {
      const cached = this.#replies.get(key);
      return cached.signature === signature ? { response: cached.response, frames: [] } : { response: null, frames: [] };
    }
    this.#buffer = [];
    let outcome;
    try {
      outcome = this.#dispatch(bytes);
    } finally {
      var frames = this.#buffer;
      this.#buffer = null;
    }
    if (key && outcome.response) {
      this.#replies.set(key, { signature, response: outcome.response });
      if (this.#replies.size > REPLY_CACHE) this.#replies.delete(this.#replies.keys().next().value);
    }
    if (outcome.error) this.#log(`[sichuan] 请求被拒绝：${outcome.error}`);
    // 原服先回应答再推通知；同步产生的通知在应答之后按序交付。
    return { response: outcome.response, frames: frames.map((frame) => [frame.cmd, frame.bytes]) };
  }

  #dispatch(bytes) {
    let request;
    try { request = decodeMaJiangEnvelope(bytes); } catch { return { error: 'malformedRequest', response: null }; }
    const view = this.#session.view();
    const reply = (cmd, result, error = null, extra = []) => ({ error,
      response: encodeMaJiangEnvelope(cmd, { result }), extra });
    if (request.name === 'ReqTuoGuanChange') {
      if (request.extraLogicData.length) return reply(Msg.ERspTuoGuanChange, Result.Fail_InvalidParam, 'unsupportedExtraLogic');
      const enabled = request.payload.tuoGuanStatus !== 0;
      const outcome = this.#session.setAutoplay(enabled, view.connectionId);
      if (!outcome.ok) return reply(Msg.ERspTuoGuanChange, Result.Fail_InvalidSequence, outcome.error);
      this.#buffer.push({ cmd: Msg.ENtfTuoGuanChange, bytes: encodeMaJiangEnvelope(Msg.ENtfTuoGuanChange,
        { seat: view.seat, tuoGuanStatus: enabled ? 1 : 0, userInfos: [] }) });
      return reply(Msg.ERspTuoGuanChange, Result.Succ);
    }
    if (request.name === 'ReqExit') {
      // 血战胡牌后本人分数已冻结，可离桌；未胡牌离桌会逃避后续支付，不允许。
      const state = this.#session.snapshot();
      if (request.extraLogicData.length || !(state.players[view.seat].won || this.#session.matchOver)) {
        return reply(Msg.ERspExit, Result.Fail_InvalidSequence, 'exitBeforeWin');
      }
      this.#exited = true;
      this.#buffer.push({ cmd: Msg.ENtfExit, bytes: encodeMaJiangEnvelope(Msg.ENtfExit, { seat: view.seat, userInfos: [] }) });
      this.#settle(state.scores[view.seat], 'exit');
      return reply(Msg.ERspExit, Result.Succ);
    }
    return handleSichuanRequest(this.#session, bytes, { connectionId: view.connectionId, windowId: view.windowId });
  }

  get exited() { return this.#exited; }

  /** 断线：真人席交给AI；会话继续推进，事件仍由外层缓存。 */
  detach() {
    const view = this.#session.view();
    return this.#session.detach(view.connectionId);
  }

  attach() {
    this.#replies.clear();
    return this.#session.attach();
  }

  /**
   * 离桌：胡牌后或终局结算本人冻结分数；未胡就离桌按当前已发生的即时收付结算，
   * 不再继续承担后续支付（本地单机约定，避免未完成牌局吞掉已发生的输赢）。
   */
  leave() {
    if (!this.#settled && !this.#failed && this.#session.status !== 'idle') {
      const state = this.#session.snapshot();
      this.#settle(state.scores[this.#session.view().seat], 'leave');
    }
    this.#session.stop();
  }

  stop() { this.#session.stop(); }
}
