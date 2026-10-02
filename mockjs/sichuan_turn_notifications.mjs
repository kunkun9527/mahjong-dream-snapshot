import { MaJiangAction as Action, MaJiangMsg, encodeMaJiangEnvelope } from './majiang_pb.mjs';
import { sichuanKind } from './sichuan_hand.mjs';

const seats = [0, 1, 2, 3];
const turnActions = { discard: Action.Normal, ankan: Action.AnGang, kakan: Action.PengGang, hu: Action.Hu };
const claimActions = { pass: Action.Guo, pon: Action.Peng, kan: Action.MingGang, hu: Action.Hu };

function checkSeat(seat) {
  if (!Number.isInteger(seat) || !seats.includes(seat)) throw new RangeError('无效的通知座位');
}

function checkEvent(event, type) {
  if (!event || event.type !== type || !Number.isSafeInteger(event.index) || event.index < 0) {
    throw new TypeError(`需要有效的四川${type}事件`);
  }
  sichuanKind(event.tile);
}

function actions(types, mapping) {
  if (!Array.isArray(types) || new Set(types).size !== types.length
      || types.some((type) => typeof type !== 'string' || !Object.hasOwn(mapping, type))) {
    throw new TypeError('无效的四川事件动作候选');
  }
  return types.map((type) => mapping[type]);
}

function frame(eventIndex, name, payload) {
  const cmd = MaJiangMsg[`E${name}`];
  return { eventIndex, name, cmd, payload, bytes: encodeMaJiangEnvelope(cmd, payload) };
}

/**
 * 两个纯事件构造器，不是完整下行分派器，不能直接遍历事件过滤后发送。
 * 未来接线须按事件顺序穿插碰杠胡/结算通知，并负责游标、重连与外层有序传输。
 * 输入只能来自服务端权威事件；humanSeat由认证会话指定，不能来自客户端报文。
 * 不读取当前手牌/候选补造历史；事件内各席位候选仅供服务端，输出逐字段白名单投影。
 */
export function buildSichuanDrawNotification(event, humanSeat) {
  checkEvent(event, 'draw');
  checkSeat(event.seat);
  checkSeat(humanSeat);
  if (!['draw', 'kong'].includes(event.source) || !Number.isInteger(event.remaining)
      || event.remaining < 0 || event.remaining > 54) throw new RangeError('无效的四川摸牌事件');
  const canPlayActions = actions(event.actionTypes, turnActions);
  if (!event.actionTypes.includes('discard')) throw new TypeError('摸牌事件缺少出牌候选');
  return frame(event.index, 'NtfSendCard', {
    seat: event.seat, remainDuiCardNum: event.remaining,
    // 原34255按数组下标处理四座位，仅为NtfSendCard.seat增加一张牌。
    userInfos: seats.map((seat) => ({ seat,
      card: seat === event.seat && seat === humanSeat ? event.tile : 0,
      canPlayActions: seat === event.seat && seat === humanSeat ? [...canPlayActions] : [],
      tingInfos: [], chuPai2Timeout: 0, isDianGangHuaDianPao: false,
    })),
    // chuPai1Timeout已由开局通知给出；chuPai2Timeout为附加时间，不能再填一次基础时间。
  });
}

export function buildSichuanDiscardNotification(event, claimWindow, humanSeat) {
  checkEvent(event, 'discard');
  checkEvent(claimWindow, 'claimWindow');
  checkSeat(event.seat);
  checkSeat(humanSeat);
  if (typeof event.isMoQie !== 'boolean' || claimWindow.kind !== 'discard'
      || claimWindow.index !== event.index + 1 || claimWindow.from !== event.seat
      || claimWindow.tile !== event.tile || !Array.isArray(claimWindow.actionTypes)
      || claimWindow.actionTypes.length !== 4) throw new TypeError('出牌事件与抢牌窗口不匹配');
  const candidates = claimWindow.actionTypes.map((types) => {
    const result = actions(types, claimActions);
    if (types.length && (!types.includes('pass') || types.length < 2)) throw new TypeError('无效的抢牌窗口候选');
    return result;
  });
  if (candidates[event.seat].length) throw new TypeError('出牌者不能抢自己的牌');
  return frame(event.index, 'NtfPlayCard', {
    seat: event.seat, card: event.tile, action: Action.Normal, isMoQie: event.isMoQie,
    // 原34272同样按数组下标更新动作，并从开局qiangPaiTimeout建立基础截止时间。
    userInfos: seats.map((seat) => ({ seat,
      canQiangActions: seat === humanSeat ? [...candidates[seat]] : [],
      canGangNoNumCardsAfterRiichiHu: [],
    })),
    moneyLogs: [], isFinish: false,
    // 可胡只是候选，不是已胡；不得在有人响应前标记完成或预扣分数。
  });
}
