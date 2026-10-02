import test from 'node:test';
import assert from 'node:assert/strict';
import { handleSichuanRequest } from '../mockjs/sichuan_requests.mjs';
import { SichuanSession } from '../mockjs/sichuan_session.mjs';
import { MaJiangAction as Action, MaJiangMsg as Msg, MaJiangResult as Result,
  encodeMaJiangEnvelope, decodeMaJiangEnvelope } from '../mockjs/majiang_pb.mjs';
import { buildSichuanWall } from '../mockjs/sichuan_hand.mjs';

function stub(phase, options, hand = []) {
  const calls = [];
  const view = { phase, options, hand, connectionId: 3, windowId: 8, status: 'playing', connected: true };
  const session = { view: () => structuredClone(view), submit(chosen, context) {
    calls.push({ chosen, context });
    return { ok: true };
  } };
  Object.defineProperty(session, 'snapshot', { get() { assert.fail('适配器不得读取完整暗牌快照'); } });
  return { session, calls, view };
}
const option = (type, tiles = []) => ({ type, tiles });
function request(session, name, payload = {}, context = session.view(), envelope = {}) {
  const packet = encodeMaJiangEnvelope(Msg[`E${name}`], payload, envelope);
  const result = handleSichuanRequest(session, packet, context);
  assert.ok(result.response);
  const decoded = decodeMaJiangEnvelope(result.response);
  assert.equal(decoded.name, name.replace(/^Req/, 'Rsp'));
  assert.equal(result.ok, decoded.payload.result === Result.Succ);
  return decoded.payload.result;
}

function setup(t, seed = 7) {
  let now = 1000;
  let id = 0;
  const jobs = new Map();
  const errors = [];
  const session = new SichuanSession({ seed, aiDelayMs: 10,
    clock: { now: () => now, setTimeout(fn, delay) { jobs.set(++id, { fn, due: now + delay }); return id; },
      clearTimeout(timer) { jobs.delete(timer); } }, onError: (error) => errors.push(error) });
  t.after(() => { session.stop(); assert.deepEqual(errors, []); assert.equal(jobs.size, 0); });
  session.start();
  return { session, jump(ms) { now += ms; }, next() {
    const entry = [...jobs].sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
    assert.ok(entry, '进行中会话必须有下一步任务');
    jobs.delete(entry[0]); now = Math.max(now, entry[1].due); entry[1].fn();
  } };
}

test('四川上行：准备和换牌使用真实会话，重复与非法请求不修改状态或续时', (t) => {
  const { session } = setup(t);
  assert.equal(request(session, 'ReqPrepare'), Result.Succ);
  assert.equal(request(session, 'ReqPrepare'), Result.Fail_InvalidSequence);
  const view = session.view();
  const before = session.snapshot();
  const tiles = view.options[0].tiles;
  assert.equal(request(session, 'ReqChangeCard', { cards: [tiles[0], tiles[0], tiles[1]] }), Result.Fail_InvalidChangeCards);
  assert.equal(request(session, 'ReqDingQue', { dingQue: 1 }), Result.Fail_InvalidDingQue);
  assert.deepEqual(session.snapshot(), before);
  assert.equal(session.view().expiresAt, view.expiresAt);
  assert.equal(request(session, 'ReqChangeCard', { cards: [...tiles].reverse() }), Result.Succ);
  const accepted = session.snapshot();
  assert.equal(request(session, 'ReqChangeCard', { cards: tiles }), Result.Fail_InvalidChangeCards);
  assert.deepEqual(session.snapshot(), accepted);
});

test('四川上行：定缺仅接收协议万筒条1/2/3，不能提交日麻花色或越界值', () => {
  for (const suit of [0, 1, 2, 3, 4, -1]) {
    const { session, calls } = stub('missing', [1, 2, 3].map((value) => option('missing', [value])));
    assert.equal(request(session, 'ReqDingQue', { dingQue: suit }), suit >= 1 && suit <= 3 ? Result.Succ : Result.Fail_InvalidDingQue);
    assert.equal(calls.length, suit >= 1 && suit <= 3 ? 1 : 0);
  }
});

test('四川上行：暗杠单张代表只能映射到同一权威四实体候选，输入不变', () => {
  const tiles = [151, 152, 153, 154];
  for (const card of tiles) {
    const { session, calls, view } = stub('turn', [option('ankan', tiles)], [...tiles, 211]);
    const before = structuredClone(view);
    assert.equal(request(session, 'ReqPlayCard', { action: Action.AnGang, card }), Result.Succ);
    assert.deepEqual(calls[0].chosen, option('ankan', tiles));
    assert.deepEqual(calls[0].context, { connectionId: 3, windowId: 8 });
    assert.deepEqual(view, before);
    assert.equal(request(session, 'ReqPlayCard', { action: Action.AnGang, card: 150 }), Result.Fail_CardNotInHand);
    assert.equal(request(session, 'ReqPlayCard', { action: Action.AnGang, card: 211 }), Result.Fail_CardNotMatchAction);
    assert.equal(calls.length, 1);
  }
});

test('四川上行：补杠使用实际第四张，弃牌遵守打缺；禁止把明杠或立直塞入自摸窗口', () => {
  const { session, calls } = stub('turn', [option('kakan', [154]), option('discard', [211])], [154, 211]);
  assert.equal(request(session, 'ReqPlayCard', { action: Action.PengGang, card: 154 }), Result.Succ);
  assert.equal(request(session, 'ReqPlayCard', { action: Action.Normal, card: 154 }), Result.Fail_CardInCantPlays);
  assert.equal(request(session, 'ReqPlayCard', { action: Action.Normal, card: 211 }), Result.Succ);
  for (const action of [Action.MingGang, Action.Chi, Action.Riichi, Action.Guo, 99]) {
    assert.equal(request(session, 'ReqPlayCard', { action, card: 211 }), Result.Fail_ActionNotInCanPlayActions);
  }
  assert.equal(calls.length, 2);
});

test('四川上行：碰明杠核对实体集合，不接受牌种、缺张、重复牌或吃牌', () => {
  const { session, calls } = stub('claim', [option('pass'), option('pon', [151, 154]), option('kan', [151, 153, 154])]);
  assert.equal(request(session, 'ReqQiangCard', { action: Action.Peng, otherCards: [154, 151] }), Result.Succ);
  assert.equal(request(session, 'ReqQiangCard', { action: Action.MingGang, otherCards: [154, 151, 153] }), Result.Succ);
  for (const otherCards of [[], [150, 150], [151, 151], [151, 152], [151, 153, 154]]) {
    assert.equal(request(session, 'ReqQiangCard', { action: Action.Peng, otherCards }), Result.Fail_InvalidOtherCards);
  }
  assert.equal(request(session, 'ReqQiangCard', { action: Action.Chi, otherCards: [141, 161] }), Result.Fail_ActionNotInCanQiangActions);
  assert.equal(request(session, 'ReqQiangCard', { action: Action.AnGang, otherCards: [151, 153, 154] }), Result.Fail_ActionNotInCanQiangActions);
  assert.equal(calls.length, 2);
});

test('四川上行：胡牌和过牌都必须存在合法候选，不用客户端超时标记扩展权限', () => {
  const own = stub('turn', [option('hu')], [111]);
  assert.equal(request(own.session, 'ReqPlayCard', { action: Action.Hu }), Result.Succ);
  assert.equal(request(own.session, 'ReqPlayCard', { action: Action.Hu, card: 111 }), Result.Succ);
  assert.equal(request(own.session, 'ReqPlayCard', { action: Action.Hu, card: 112 }), Result.Fail_CardNotInHand);
  const claim = stub('claim', [option('pass'), option('hu')]);
  assert.equal(request(claim.session, 'ReqQiangCard', { action: Action.Hu }), Result.Succ);
  assert.equal(request(claim.session, 'ReqQiangCard', { action: Action.Guo }), Result.Succ);
  assert.equal(request(claim.session, 'ReqQiangCard', { action: Action.Hu, otherCards: [111] }), Result.Fail_InvalidOtherCards);
  const denied = stub('turn', [option('discard', [111])], [111]);
  assert.equal(request(denied.session, 'ReqPlayCard', { action: Action.Hu, isTimeout: true, isChuPai1Timeout: true }), Result.Fail_ActionNotInCanPlayActions);
  assert.equal(denied.calls.length, 0);
});

test('四川上行：GameNumber不替代可信窗口，过期/旧连接请求保留当前权威状态', (t) => {
  const { session } = setup(t);
  request(session, 'ReqPrepare');
  const old = session.view();
  const payload = { cards: old.options[0].tiles };
  const before = session.snapshot();
  assert.equal(request(session, 'ReqChangeCard', payload, { connectionId: old.connectionId }, { gameNumber: old.windowId }), Result.Fail_InvalidSequence);
  assert.equal(request(session, 'ReqChangeCard', payload, { ...old, windowId: old.windowId - 1 }), Result.Fail_InvalidSequence);
  session.detach(old.connectionId);
  session.attach();
  assert.equal(request(session, 'ReqChangeCard', payload, old), Result.Fail_InvalidSequence);
  assert.deepEqual(session.snapshot(), before);
  // 实际客户端不写GameNumber也能操作；一个不相关的局编号不能覆盖可信上下文。
  assert.equal(request(session, 'ReqChangeCard', payload, session.view(), { gameNumber: 987654 }), Result.Succ);
});

test('四川上行：会话期限与托管检查仍在最终提交处生效，伪造超时不能复活已过期动作', (t) => {
  const { session, jump } = setup(t);
  request(session, 'ReqPrepare');
  const view = session.view();
  const payload = { cards: view.options[0].tiles };
  const before = session.snapshot();
  session.setAutoplay(true, view.connectionId);
  assert.equal(request(session, 'ReqChangeCard', payload), Result.Fail_InvalidSequence);
  session.setAutoplay(false, view.connectionId);
  jump(view.remainingMs);
  assert.equal(request(session, 'ReqChangeCard', payload), Result.Fail_InvalidSequence);
  assert.deepEqual(session.snapshot(), before);
});

test('四川上行：未实现的破产离桌托管和自动开关明确失败且不写状态', (t) => {
  const { session } = setup(t);
  const before = session.snapshot();
  for (const [name, payload] of [['ReqPoChanChange', { poChanStatus: 2 }], ['ReqExit', {}],
    ['ReqTuoGuanChange', { tuoGuanStatus: 1 }], ['ReqSetInternalState', { InternalState: { 2: 1 } }]]) {
    assert.equal(request(session, name, payload), Result.Fail_InvalidParam);
  }
  assert.deepEqual(session.snapshot(), before);
  assert.equal(session.view().autoplay, false);
  assert.equal(session.status, 'preparing');
});

test('四川上行：畸形消息、通知、响应、GM和不透明额外逻辑都不能执行动作', () => {
  const { session, calls } = stub('claim', [option('pass')]);
  for (const bytes of [new Uint8Array(), Uint8Array.of(8, 255), Uint8Array.of(8, 209, 134, 3),
    encodeMaJiangEnvelope(Msg.ENtfGameStart, {}), encodeMaJiangEnvelope(Msg.ERspPrepare, {})]) {
    const result = handleSichuanRequest(session, bytes, session.view());
    assert.equal(result.ok, false);
    assert.equal(result.response, null);
  }
  const normal = encodeMaJiangEnvelope(Msg.EReqQiangCard, { action: Action.Guo });
  const withExtra = Uint8Array.from([...normal, 18, 0]); // field2 repeated bytes，内容尚未核验。
  const result = handleSichuanRequest(session, withExtra, session.view());
  assert.equal(decodeMaJiangEnvelope(result.response).payload.result, Result.Fail_InvalidParam);
  assert.equal(calls.length, 0);
});

function packetFor(view, chosen) {
  if (chosen.type === 'exchange') return ['ReqChangeCard', { cards: chosen.tiles }];
  if (chosen.type === 'missing') return ['ReqDingQue', { dingQue: chosen.tiles[0] }];
  const action = { discard: Action.Normal, pass: Action.Guo, pon: Action.Peng, kan: Action.MingGang,
    kakan: Action.PengGang, ankan: Action.AnGang, hu: Action.Hu }[chosen.type];
  return view.phase === 'claim' ? ['ReqQiangCard', { action, otherCards: chosen.tiles }]
    : ['ReqPlayCard', { action, card: chosen.tiles[0] ?? 0 }];
}

test('四川上行：真人席全程用原协议封包完成三个固定种子单局，逐动作守恒且退出席不再提交', (t) => {
  const seen = new Set();
  for (const seed of [7, 19, 42]) {
    const { session, next } = setup(t, seed);
    assert.equal(request(session, 'ReqPrepare'), Result.Succ);
    let steps = 0;
    while (!session.matchOver) {
      assert.ok(++steps < 1200, '协议驱动单局必须结束');
      const view = session.view();
      if (view.options.length) {
        const chosen = (seed === 42 && view.phase === 'claim' ? view.options.find((item) => item.type === 'pass') : null)
          ?? view.options.find((item) => item.type === 'hu')
          ?? view.options.find((item) => ['ankan', 'kakan', 'kan', 'pon'].includes(item.type))
          ?? view.options[0];
        seen.add(chosen.type);
        const [name, payload] = packetFor(view, chosen);
        assert.equal(request(session, name, payload), Result.Succ);
      } else next();
      const state = session.snapshot();
      const entities = [...state.wall, ...state.robbedTiles, ...state.players.flatMap((player) => [
        ...player.hand, ...player.melds.flatMap((meld) => meld.tiles),
        ...player.river.filter((entry) => !entry.claimed).map((entry) => entry.tile),
      ])];
      assert.deepEqual(entities.sort((a, b) => a - b), buildSichuanWall());
      assert.equal(state.scores.reduce((sum, value) => sum + value, 0), 0);
      if (state.players[0].won) assert.deepEqual(session.view().options, []);
    }
    assert.equal(request(session, 'ReqPrepare'), Result.Fail_InvalidSequence);
  }
  for (const type of ['exchange', 'missing', 'discard', 'pass']) assert.ok(seen.has(type), type);
});
