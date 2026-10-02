import { SichuanSession } from './sichuan_session.mjs';
import { chooseSichuanExchange, chooseSichuanMissingSuit } from './sichuan_ai.mjs';
import { MaJiangAction, MaJiangMsg, encodeMaJiangEnvelope } from './majiang_pb.mjs';

const seats = [0, 1, 2, 3];
const seconds = (milliseconds) => Math.ceil(milliseconds / 1000);
const playActions = { discard: MaJiangAction.Normal, ankan: MaJiangAction.AnGang,
  kakan: MaJiangAction.PengGang, hu: MaJiangAction.Hu };
// 客户端桌面座位按本人、右、对、左排列；+1为逆时针，+2对换，+3顺时针。
// 原 ChangeCardType 是 Shun=1 / Ni=2 / Dui=3，不能直接发送引擎 offset。
const exchangeTypes = { 1: 2, 2: 3, 3: 1 };

function frame(name, payload) {
  const cmd = MaJiangMsg[`E${name}`];
  return { name, cmd, payload, bytes: encodeMaJiangEnvelope(cmd, payload) };
}

/**
 * 仅负责准备至定缺结束的下行投影，不是完整四川协议会话。
 * 必须在 session.start() 前创建，并在每次 onUpdate 中调用 read()。
 * snapshot 只在服务端读取；输出逐字段白名单构造，绝不广播原始快照。
 * 返回的帧应交给外层有序传输；此处不发送、不缓存RPC、不重放、不记账。
 */
export class SichuanOpeningNotifications {
  #session;
  #context;
  #status = 'idle';
  #exchanges = [null, null, null, null];
  #missing = [null, null, null, null];
  #complete = false;

  constructor(session, { gameID, userIds, initialScores, scoreType } = {}) {
    if (!(session instanceof SichuanSession) || session.status !== 'idle') throw new TypeError('开局投影必须在会话启动前创建');
    if (typeof gameID !== 'string' || !gameID.trim() || gameID.length > 128
        || !Array.isArray(userIds) || userIds.length !== 4 || new Set(userIds).size !== 4
        || userIds.some((id) => !Number.isSafeInteger(id) || id <= 0)
        || !Array.isArray(initialScores) || initialScores.length !== 4
        || initialScores.some((score) => !Number.isSafeInteger(score) || score < 0)
        || !Number.isInteger(scoreType) || scoreType < 0 || scoreType > 2147483647) {
      throw new RangeError('无效的开局桌面资料');
    }
    this.#session = session;
    // 余额与scoreType由未来的房间/钱包接线显式提供，不能把积分差额当钱包余额。
    this.#context = structuredClone({ gameID, userIds, initialScores, scoreType });
  }

  get complete() { return this.#complete; }

  #start(state, view) {
    const { gameID, initialScores, scoreType } = this.#context;
    const timeouts = this.#session.timeoutsMs;
    return frame('NtfGameStart', {
      changWind: 0, juNum: 0, zhuangSeat: state.dealer, totalJuNum: 1,
      remainDuiCardNum: view.remaining, gameID, baseScore: state.rules.baseScore,
      topBei: state.rules.topBei, scoreType, hasDingQue: true, isMingPai: false,
      changeCardRule: state.rules.exchange ? 1 : 0,
      changeCardType: state.rules.exchange ? exchangeTypes[state.exchangeOffset] : 0,
      huanZhangTimeout: seconds(timeouts.exchange), dingQueTimeout: seconds(timeouts.missing),
      chuPai1Timeout: seconds(timeouts.turn), qiangPaiTimeout: seconds(timeouts.claim),
      // 仅用于发牌演出；不额外消耗引擎随机数或影响牌山。
      touzi1: (state.seed >>> 0) % 6 + 1, touzi2: (state.seed >>> 3) % 6 + 1,
      userInfos: seats.map((seat) => ({ seat, score: initialScores[seat],
        handCards: seat === view.seat ? view.hand : Array(view.handCounts[seat]).fill(0),
        changeCardSuggest: seat === view.seat && state.rules.exchange ? chooseSichuanExchange(view.hand) : [],
        dingQueSuggest: seat === view.seat && !state.rules.exchange ? chooseSichuanMissingSuit(view.hand) : 0,
        canPlayActions: [], chuPai2Timeout: 0,
      })),
    });
  }

  read() {
    const view = this.#session.view();
    // 已停止/结束不能补发迟到开局；重连必须另走权威快照，不能重置此投影。
    if (this.#complete || ['idle', 'stopped', 'failed', 'ended'].includes(view.status)) return [];
    if (view.status === 'preparing') {
      if (this.#status === 'preparing') return [];
      const result = frame('NtfToPrepare', { userInfos: seats.map((seat) => ({ seat, userID: this.#context.userIds[seat] })) });
      this.#status = 'preparing';
      return [result];
    }
    if (this.#status === 'idle') throw new Error('开局投影遗漏准备通知');
    const state = this.#session.snapshot();
    const changedExchanges = seats.filter((seat) => this.#exchanges[seat] === null && state.exchanges[seat] !== null);
    const changedMissing = seats.filter((seat) => this.#missing[seat] === null && state.players[seat].missingSuit !== null);
    const starting = this.#status === 'preparing';
    if ((starting && (changedExchanges.length || changedMissing.length))
        || changedExchanges.length + changedMissing.length > 1
        || !['exchange', 'missing', 'turn'].includes(state.phase)
        || state.players.some((player) => player.discardCount || player.drawCount || player.melds.length)) {
      throw new Error('开局投影遗漏状态更新，禁止用当前手牌补造历史通知');
    }
    const frames = [];
    if (starting) {
      // 三个本地机器人与真人/准备超时一起就绪；不伪造真人上行请求。
      for (const seat of seats) frames.push(frame('NtfPrepare', { seat, userInfos: seats.map((entry) => ({ seat: entry })) }));
      frames.push(this.#start(state, view));
    }
    for (const seat of changedExchanges) {
      frames.push(frame('NtfChangeCard', { seat, cardNum: 3,
        userInfos: seats.map((entry) => ({ seat: entry, cards: entry === seat && entry === view.seat ? state.exchanges[entry] : [] })),
      }));
      if (state.exchanges.every((cards) => cards !== null)) {
        frames.push(frame('NtfChangeCardEnd', { userInfos: seats.map((entry) => ({ seat: entry,
          // 原34283按数组下标取玩家，再逐张移出/加入手牌；他家用等量背牌维持手牌数。
          cards: entry === view.seat ? state.exchanges[entry] : [0, 0, 0],
          getCards: entry === view.seat ? state.exchanges[(entry - state.exchangeOffset + 4) % 4] : [0, 0, 0],
          dingQueSuggest: entry === view.seat ? chooseSichuanMissingSuit(view.hand) : 0,
          canPlayActions: [], chuPai2Timeout: 0,
        })) }));
      }
    }
    for (const seat of changedMissing) {
      frames.push(frame('NtfDingQue', { seat,
        userInfos: seats.map((entry) => ({ seat: entry,
          dingQue: entry === seat && entry === view.seat ? state.players[entry].missingSuit : 0,
        })),
      }));
      if (state.players.every((player) => player.missingSuit !== null)) {
        frames.push(frame('NtfDingQueEnd', { userInfos: seats.map((entry) => ({ seat: entry,
          dingQue: state.players[entry].missingSuit,
          canPlayActions: entry === view.seat && state.turn === entry
            ? [...new Set(view.options.map((option) => playActions[option.type]))] : [],
          chuPai2Timeout: 0,
          // 庄家第14张已在开局手牌中；此时不是再次摸牌，不发NtfSendCard。
        })) }));
      }
    }
    // 所有消息编码成功后才前移游标；读同一状态、托管或连接状态更新不重复发牌。
    this.#status = view.status;
    this.#exchanges = structuredClone(state.exchanges);
    this.#missing = state.players.map((player) => player.missingSuit);
    this.#complete = state.phase === 'turn';
    return frames;
  }
}
