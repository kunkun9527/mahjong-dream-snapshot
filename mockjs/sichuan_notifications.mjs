import { SichuanOpeningNotifications } from './sichuan_opening_notifications.mjs';
import { buildSichuanDiscardNotification, buildSichuanDrawNotification } from './sichuan_turn_notifications.mjs';
import { MaJiangAction as Action, MaJiangMsg, encodeMaJiangEnvelope } from './majiang_pb.mjs';

const seats = [0, 1, 2, 3];
const turnActions = { discard: Action.Normal, hu: Action.Hu, ankan: Action.AnGang, kakan: Action.PengGang };
const claimActions = { pass: Action.Guo, hu: Action.Hu, pon: Action.Peng, kan: Action.MingGang };
const kongTypes = { exposed: 1, added: 2, concealed: 3 };
const settlementTypes = { flower: 8, ready: 9, refund: 10, callTransfer: 11 };
const clone = (value) => structuredClone(value);

function frame(event, name, payload) {
  const cmd = MaJiangMsg[`E${name}`];
  return { eventIndex: event.index, name, cmd, payload, bytes: encodeMaJiangEnvelope(cmd, payload) };
}

function add(a, b) {
  const result = a + b;
  if (!Number.isSafeInteger(result)) throw new RangeError('四川显示积分超出安全范围');
  return result;
}

function moneyLog(type, delta, scores, initialScores, baseScore, score = null) {
  if (delta.length !== 4 || scores.length !== 4 || delta.reduce((sum, value) => sum + value, 0) !== 0) {
    throw new Error('四川积分日志不守恒');
  }
  return { type, userInfos: seats.map((seat) => ({ seat,
    money: delta[seat], finalMoney: add(initialScores[seat], scores[seat]),
    bei: delta[seat] / baseScore, fengDing: delta[seat] !== 0 && Boolean(score?.capped),
    yiTypes: delta[seat] !== 0 && score ? score.yaku.map((item) => item.yiType) : [],
    noMoney: false, sysMoney: 0,
  })) };
}

function transferDelta(transfer) {
  const delta = [0, 0, 0, 0];
  delta[transfer.from] = -transfer.amount;
  delta[transfer.to] = transfer.amount;
  return delta;
}

function endUsers(humanSeat, caller = null, event = null) {
  return seats.map((seat) => ({ seat, tingInfos: [],
    canPlayActions: seat === humanSeat && seat === caller ? event.actionTypes.map((type) => turnActions[type]) : [],
    cantPlays: seat === humanSeat && seat === caller ? [...event.cantPlays] : [],
    chuPai2Timeout: 0, canGangNoNumCardsAfterRiichiHu: [],
  }));
}

function claimEnd(event, humanSeat, { winners = [], action = Action.Guo, otherCards = [], moneyLogs = [], caller = null } = {}) {
  return frame(event, 'NtfQiangCardEnd', {
    seats: winners, action, otherCards, userInfos: endUsers(humanSeat, caller, event),
    moneyLogs, isFinish: action === Action.Hu,
  });
}

function play(event, humanSeat, { seat, card, action, moneyLogs = [], isFinish = false, canQiang = [] }) {
  return frame(event, 'NtfPlayCard', { seat, card, action, isMoQie: false, moneyLogs, isFinish,
    userInfos: seats.map((entry) => ({ seat: entry, canQiangActions: entry === humanSeat ? [...canQiang] : [],
      canGangNoNumCardsAfterRiichiHu: [] })),
  });
}

/**
 * 服务端下行分派：在 start 前创建，逐次 onUpdate 调用 read，返回帧交给有序传输。
 * 不是网络会话、重连快照或钱包接线。省略未经确认的段位、经验、排名奖励字段。
 * 抢补杠沿用原协议时序：PengGang通知开窗口，抢和后原客户端仍把该副露显示为杠，终局按权威碰摊牌。
 */
export class SichuanNotifications {
  #session;
  #opening;
  #initialScores;
  #humanSeat;
  #cursor = null;
  #pending = null;
  #scores = [0, 0, 0, 0];
  #ended = false;

  constructor(session, context) {
    this.#opening = new SichuanOpeningNotifications(session, context);
    this.#session = session;
    this.#initialScores = [...context.initialScores];
    this.#humanSeat = session.view().seat;
  }

  get complete() { return this.#ended; }

  read() {
    const status = this.#session.status;
    if (this.#ended || ['idle', 'stopped', 'failed'].includes(status)) return [];
    if (!this.#opening.complete) {
      const frames = this.#opening.read();
      if (this.#opening.complete) this.#cursor = this.#session.snapshot().events.length;
      return frames;
    }
    const state = this.#session.snapshot();
    const frames = [];
    let pending = clone(this.#pending);
    let scores = [...this.#scores];
    let ended = false;
    const humanSeat = this.#humanSeat;
    for (let index = this.#cursor; index < state.events.length; index += 1) {
      const event = state.events[index];
      if (event.index !== index || ended) throw new Error('四川事件索引或终局顺序错误');
      switch (event.type) {
        case 'discard': {
          if (pending) throw new Error('抢牌裁决尚未完成，不能继续出牌');
          pending = state.events[++index];
          frames.push(buildSichuanDiscardNotification(event, pending, humanSeat));
          break;
        }
        case 'claimWindow': {
          if (pending || event.kind !== 'added') throw new Error('缺少四川出牌事件');
          if (event.actionTypes.some((types) => types.length)) {
            // 原协议没有抢补杠专用通知：34272收到PengGang即把碰显示为杠，并按canQiangActions开抢牌窗口。
            // 抢和成立时原客户端不回退该副露，直到NtfGameStop才按doorCardsInfos显示权威的碰。
            const own = event.actionTypes[humanSeat];
            if (own.length && (!own.includes('pass') || own.some((type) => !['pass', 'hu'].includes(type)))) {
              throw new Error('抢补杠只能选择胡或过');
            }
            frames.push(play(event, humanSeat, { seat: event.from, card: event.tile, action: Action.PengGang,
              canQiang: own.map((type) => claimActions[type]) }));
            pending = { ...event, announced: true };
          } else pending = event; // 无人可抢：等待紧随其后的已提交kong事件再显示补杠。
          break;
        }
        case 'claimResponse': {
          if (!pending || !pending.actionTypes[event.seat]?.includes(event.action)) throw new Error('缺少有效的抢牌窗口');
          // 未裁决的碰/杠可能被胡牌抢占；不能提前公开选中的暗手实体。
          frames.push(frame(event, 'NtfQiangCard', { seat: event.seat, action: claimActions[event.action],
            otherCards: event.seat === humanSeat ? [...event.tiles] : [], userInfos: seats.map((seat) => ({ seat })),
          }));
          break;
        }
        case 'claimPassed': {
          if (!pending || pending.kind !== 'discard' || pending.from !== event.from || pending.tile !== event.tile) {
            throw new Error('过牌裁决与抢牌窗口不匹配');
          }
          frames.push(claimEnd(event, humanSeat));
          pending = null;
          break;
        }
        case 'pon': {
          if (!pending || pending.kind !== 'discard' || pending.from !== event.from || pending.tile !== event.tile) {
            throw new Error('碰牌裁决与抢牌窗口不匹配');
          }
          frames.push(claimEnd(event, humanSeat, { winners: [event.seat], action: Action.Peng,
            otherCards: event.tiles.filter((tile) => tile !== event.tile), caller: event.seat,
          }));
          pending = null;
          break;
        }
        case 'kong': {
          const logs = event.delta.some(Boolean)
            ? [moneyLog(kongTypes[event.kind], event.delta, event.scores, this.#initialScores, event.baseScore)] : [];
          if (event.kind === 'exposed') {
            if (!pending || pending.kind !== 'discard' || event.from !== pending.from || !event.tiles.includes(pending.tile)) {
              throw new Error('明杠裁决与抢牌窗口不匹配');
            }
            frames.push(claimEnd(event, humanSeat, { winners: [event.seat], action: Action.MingGang,
              otherCards: event.tiles.filter((tile) => tile !== pending.tile), moneyLogs: logs,
            }));
          } else if (event.kind === 'added' && pending?.announced) {
            if (pending.from !== event.seat || event.tiles[0] !== pending.tile) throw new Error('补杠裁决与抢杠窗口不匹配');
            // 补杠已在窗口通知中展示；全部过后只结束窗口并在此时收杠款。
            frames.push(claimEnd(event, humanSeat, { moneyLogs: logs }));
          } else if (event.kind === 'concealed' && pending === null || event.kind === 'added' && pending?.kind === 'added') {
            // 暗杠只向本人发代表实体；原34272归一到牌种后一次移除四张。
            frames.push(play(event, humanSeat, { seat: event.seat,
              card: event.kind === 'concealed' && event.seat !== humanSeat ? 0 : event.tiles[0],
              action: event.kind === 'concealed' ? Action.AnGang : Action.PengGang, moneyLogs: logs,
            }));
            frames.push(claimEnd(event, humanSeat));
          } else throw new Error('无效的四川杠牌事件');
          scores = [...event.scores];
          pending = null;
          break;
        }
        case 'win': {
          const tsumo = event.winType === 'tsumo';
          if (tsumo ? pending !== null : pending === null) throw new Error('胡牌裁决与抢牌窗口不匹配');
          const logs = event.results.map((result) => moneyLog(tsumo ? 4 : 5, result.delta, result.scores,
            this.#initialScores, event.baseScore, result.score));
          scores = [...event.results.at(-1).scores];
          if (event.callTransfer) {
            logs.push(moneyLog(11, transferDelta(event.callTransfer), event.callTransfer.scores,
              this.#initialScores, event.baseScore));
            scores = [...event.callTransfer.scores];
          }
          if (tsumo) {
            const result = event.results[0];
            frames.push(play(event, humanSeat, { seat: result.seat, card: result.tile, action: Action.Hu,
              moneyLogs: logs, isFinish: true,
            }));
          } else frames.push(claimEnd(event, humanSeat, { winners: event.results.map((result) => result.seat),
            action: Action.Hu, moneyLogs: logs,
          }));
          pending = null;
          break;
        }
        case 'draw': {
          if (pending) throw new Error('抢牌裁决尚未完成，不能继续摸牌');
          frames.push(buildSichuanDrawNotification(event, humanSeat));
          break;
        }
        case 'end': {
          if (pending || state.phase !== 'ended' || index !== state.events.length - 1) throw new Error('缺少完整的四川终局状态');
          const logs = [];
          for (const transfer of event.settlement?.transfers ?? []) {
            const delta = transferDelta(transfer);
            scores = scores.map((score, seat) => add(score, delta[seat]));
            logs.push(moneyLog(settlementTypes[transfer.reason], delta, scores, this.#initialScores, state.rules.baseScore));
          }
          if (scores.some((value, seat) => value !== event.scores[seat])) throw new Error('四川下行结算与权威分数不符');
          const lastWin = event.reason === 'threeWinners' ? state.events[index - 1] : null;
          if (lastWin && lastWin.type !== 'win') throw new Error('三家胡牌终局缺少最后裁决');
          const latest = lastWin?.results[0];
          frames.push(frame(event, 'NtfGameStop', {
            huSeats: lastWin?.results.map((result) => result.seat) ?? [],
            huCardSeat: latest ? latest.from ?? latest.seat : 0, huCard: latest?.tile ?? 0,
            isFinal: true, stopType: 0, moneyLogs: logs,
            userInfos: state.players.map((player, seat) => ({ seat, score: add(this.#initialScores[seat], scores[seat]),
              changeScore: scores[seat], totalBei: scores[seat] / state.rules.baseScore,
              // 原34272已将自摸张移出暗手并单独展示；终局不能再次放回手牌区。
              handCards: player.hand.filter((tile) => !(player.win?.from === null && tile === player.win.tile)),
              isFinish: player.won,
              doorCardsInfos: player.melds.map((meld) => ({ cards: [...meld.tiles],
                action: meld.type === 'pon' ? Action.Peng : meld.type === 'ankan' ? Action.AnGang
                  : meld.kongKind === 'added' ? Action.PengGang : Action.MingGang,
                qiangSeat: meld.from ?? seat,
              })),
              huInfos: player.win ? [{ huCard: player.win.tile,
                huType: player.win.from === null ? 1 : player.win.score.winType === 'robKong' ? 3 : 2 }] : [],
            })),
          }));
          ended = true;
          break;
        }
        default: throw new Error(`未适配的四川事件：${event.type}`);
      }
    }
    // 所有消息编码成功后提交游标；失败不会交付半批通知或吞掉尚未适配事件。
    this.#cursor = state.events.length;
    this.#pending = pending;
    this.#scores = scores;
    this.#ended = ended;
    return frames;
  }
}
