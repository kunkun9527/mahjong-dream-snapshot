import { MaJiangAction as Action, MaJiangMsg as Msg, MaJiangResult as Result,
  decodeMaJiangEnvelope, encodeMaJiangEnvelope } from './majiang_pb.mjs';

const requests = new Map([
  ['ReqPrepare', Msg.ERspPrepare], ['ReqPlayCard', Msg.ERspPlayCard],
  ['ReqQiangCard', Msg.ERspQiangCard], ['ReqChangeCard', Msg.ERspChangeCard],
  ['ReqDingQue', Msg.ERspDingQue], ['ReqPoChanChange', Msg.ERspPoChanChange],
  ['ReqExit', Msg.ERspExit], ['ReqTuoGuanChange', Msg.ERspTuoGuanChange],
  ['ReqSetInternalState', Msg.ERspSetInternalState],
]);
const sameTiles = (a, b) => a.length === b.length && new Set(a).size === a.length
  && a.every((tile) => b.includes(tile));

function selectAction(view, name, payload) {
  const options = view.options;
  const find = (type, tiles) => options.find((option) => option.type === type && sameTiles(tiles, option.tiles));
  if (name === 'ReqChangeCard') {
    return { chosen: view.phase === 'exchange' && find('exchange', payload.cards),
      result: Result.Fail_InvalidChangeCards };
  }
  if (name === 'ReqDingQue') {
    return { chosen: view.phase === 'missing' && find('missing', [payload.dingQue]),
      result: Result.Fail_InvalidDingQue };
  }
  if (name === 'ReqQiangCard') {
    if (view.phase !== 'claim') return { result: Result.Fail_InvalidSequence };
    const type = { [Action.Guo]: 'pass', [Action.Peng]: 'pon', [Action.MingGang]: 'kan', [Action.Hu]: 'hu' }[payload.action];
    if (!type || !options.some((option) => option.type === type)) return { result: Result.Fail_ActionNotInCanQiangActions };
    return { chosen: find(type, payload.otherCards), result: Result.Fail_InvalidOtherCards };
  }
  if (name === 'ReqPlayCard') {
    if (view.phase !== 'turn') return { result: Result.Fail_InvalidSequence };
    const type = { [Action.Normal]: 'discard', [Action.PengGang]: 'kakan', [Action.AnGang]: 'ankan', [Action.Hu]: 'hu' }[payload.action];
    if (!type || !options.some((option) => option.type === type)) return { result: Result.Fail_ActionNotInCanPlayActions };
    if (type === 'hu') {
      // 自摸请求的 card 可省略；非零实体必须属于本人，不能信任客户端自报和牌。
      return { chosen: (payload.card === 0 || view.hand.includes(payload.card)) && find('hu', []),
        result: Result.Fail_CardNotInHand };
    }
    if (!view.hand.includes(payload.card)) return { result: Result.Fail_CardNotInHand };
    // 原 ReqPlayCard 只有单张 card：暗杠只能从权威候选补齐，不能自行凑同种牌。
    const chosen = options.find((option) => option.type === type && option.tiles.includes(payload.card));
    return { chosen, result: type === 'discard' ? Result.Fail_CardInCantPlays : Result.Fail_CardNotMatchAction };
  }
  return { result: Result.Fail_InvalidParam };
}

/**
 * 独立上行适配，尚未接入大厅或下行事件。
 * context 必须在可信传输入口捕获，不能从 GameNumber/客户端载荷构造。
 * 不缓存 RPC 响应，也不声称能识别不带序列的跨窗口重放；外层接线必须另做去重。
 * 超时由会话时钟裁决，客户端 isTimeout/isChuPai1Timeout 不授予自动动作权限。
 */
export function handleSichuanRequest(session, bytes, { connectionId, windowId } = {}) {
  let request;
  try { request = decodeMaJiangEnvelope(bytes); } catch {
    return { ok: false, error: 'malformedRequest', response: null };
  }
  const responseCmd = requests.get(request.name);
  if (responseCmd === undefined) return { ok: false, error: 'notARequest', response: null };
  const reply = (result, error = null) => ({ ok: result === Result.Succ, error,
    response: encodeMaJiangEnvelope(responseCmd, { result }) });
  // 不静默丢弃尚未解析的额外逻辑消息，防止一次请求只执行其中一部分。
  if (request.extraLogicData.length) return reply(Result.Fail_InvalidParam, 'unsupportedExtraLogic');
  const view = session.view();
  if (!view.connected || connectionId !== view.connectionId
      || !['preparing', 'playing'].includes(view.status)) return reply(Result.Fail_InvalidSequence, 'inactiveConnection');
  if (request.name === 'ReqPrepare') {
    const outcome = session.prepare(connectionId);
    return reply(outcome.ok ? Result.Succ : Result.Fail_InvalidSequence, outcome.error);
  }
  // 未实现的经济/退出/自动开关不得回假成功，也不借用日麻的设置枚举。
  if (!['ReqPlayCard', 'ReqQiangCard', 'ReqChangeCard', 'ReqDingQue'].includes(request.name)) {
    return reply(Result.Fail_InvalidParam, 'unsupportedRequest');
  }
  if (view.status !== 'playing' || !Number.isSafeInteger(windowId) || windowId !== view.windowId) {
    return reply(Result.Fail_InvalidSequence, 'staleWindow');
  }
  const selection = selectAction(view, request.name, request.payload);
  if (!selection.chosen) return reply(selection.result, 'illegalAction');
  const outcome = session.submit(structuredClone(selection.chosen), { connectionId, windowId });
  return reply(outcome.ok ? Result.Succ : Result.Fail_InvalidSequence, outcome.error);
}
