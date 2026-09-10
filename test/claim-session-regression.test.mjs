import test from 'node:test';
import assert from 'node:assert/strict';
import { RiichiSession, GameEngine, encodeMsg, decodeMsg, MSG_NAME } from '../mockjs/browser_entry.mjs';
import { RiichiMsg, PlayAction, Result } from '../mockjs/proto_enum.mjs';

async function flush() {
  for (let i = 0; i < 12; i++) await Promise.resolve();
}

function setup(t, players, action = PlayAction.Peng, bank = 20) {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 100_000 });
  // 只隔离整场启动循环，保留实际弃牌、动作生成、等待、校验和鸣牌执行。
  t.mock.method(GameEngine.prototype, 'start', async () => {});
  const frames = [];
  const saved = { 0: 1, 1: 1, 2: 1, 3: 0, 4: 0, 5: 1 };
  const session = new RiichiSession({
    players, speed: 0, internalState: saved,
    onFrame: (type, bytes) => frames.push({ type, payload: decodeMsg(MSG_NAME[type], bytes) }),
  });
  const engine = session.ensureEngine();
  const card = action === PlayAction.Chi ? 241 : 454;
  const used = action === PlayAction.Chi ? [221, 231]
    : action === PlayAction.MingGang ? [451, 452, 453] : [451, 452];
  const filler = [211, 261, 281, 311, 331, 351, 371, 391, 411, 421, 431];
  engine.players = Array.from({ length: players }, (_, seat) => ({
    seat, isHuman: seat === 0, score: players === 3 ? 35_000 : 25_000,
    timeBank: bank, hand: seat === 0 ? [...used, ...filler].slice(0, 13) : [],
    melds: [], discards: [], discardKinds: new Set(), waits: [],
    riichi: false, riichiTurn: -1, menzen: true, ippatsu: false,
    tempFuriten: false, riichiFuriten: false, drawnTile: null, rinshan: false,
  }));
  engine.wall = [191, 192, 193, 194];
  engine.replacements = [471];
  engine.remain = engine.wall.length;
  engine.kanCount = 0;
  engine._deferredKanDora = 0;
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.akaSet = new Set();
  engine.firstGoAround = false;
  const nextDraws = [];
  const claimTurns = [];
  engine.turnDraw = async (seat) => { nextDraws.push(seat); };
  engine.awaitTurn = async (seat, drew) => { claimTurns.push({ seat, drew }); };
  const discard = async (from = players - 1) => {
    engine.players[from].discards.push(card);
    engine.players[from].discardKinds.add(Math.floor(card / 10));
    engine.lastDiscard = { seat: from, card };
    await engine.discard(from, card, PlayAction.Normal);
  };
  const submit = (payload) => session.handleClient(RiichiMsg.EReqQiangCard, encodeMsg('ReqQiangCard', payload));
  const setting = (values) => session.handleClient(RiichiMsg.EReqSetInternalState,
    encodeMsg('ReqSetInternalState', { InternalState: values }));
  t.after(() => session.stop());
  return { session, engine, frames, card, used, discard, submit, setting, saved, nextDraws, claimTurns };
}

for (const [players, action, label] of [
  [3, PlayAction.Peng, '三麻碰'], [3, PlayAction.MingGang, '三麻明杠'],
  [4, PlayAction.Chi, '四麻吃'], [4, PlayAction.Peng, '四麻碰'], [4, PlayAction.MingGang, '四麻明杠'],
]) {
  test(`${label}：旧存档不鸣不能在按钮下发后代替真人立即过牌`, async (t) => {
    const f = setup(t, players, action);
    const done = f.discard();
    await flush();
    const notice = f.frames.find((frame) => frame.type === RiichiMsg.ENtfPlayCard).payload;
    assert.ok(notice.userInfos[0].canQiangActions.includes(action));
    assert.equal(notice.userInfos[0].leftTimer, 20);
    assert.equal(f.nextDraws.length, 0, '尚未选择，不得进入下一家');
    assert.ok(f.engine._pending, '必须保留鸣牌等待窗口');
    t.mock.timers.tick(24_000);
    await flush();
    assert.equal(f.nextDraws.length, 0);
    assert.equal(f.engine.players[0].melds.length, 0);
    assert.equal(f.frames.some((frame) => frame.type === RiichiMsg.ENtfQiangCard), false);
    f.submit({ action, otherCards: f.used });
    await done;
    assert.equal(f.frames.find((frame) => frame.type === RiichiMsg.ERspQiangCard).payload.result, Result.Succ);
    assert.equal(f.engine.players[0].timeBank, 1);
    assert.equal(f.engine.players[0].melds.length, 1);
    assert.deepEqual(f.engine.players[0].melds[0].tiles.slice().sort(), [...f.used, f.card].sort());
    assert.equal(f.frames.filter((frame) => frame.type === RiichiMsg.ENtfQiangCard).length, 1);
    assert.equal(f.frames.filter((frame) => frame.type === RiichiMsg.ENtfQiangCardEnd).length, 1);
    assert.deepEqual(f.claimTurns, [{ seat: 0, drew: action === PlayAction.MingGang }]);
    assert.equal(f.nextDraws.length, 0);
    t.mock.timers.tick(30_000);
    await flush();
    assert.equal(f.nextDraws.length, 0, '提交成功后不得有旧鸣牌超时任务推进牌局');
    assert.deepEqual(f.session.opts.internalState, f.saved, '不得删除或反转历史设置');
  });
}

test('共享备用时间按实际超出 5 秒的部分扣减，耗尽后下次鸣牌仍有 5 秒', async (t) => {
  const f = setup(t, 3);
  let done = f.discard();
  await flush();
  t.mock.timers.tick(8_000);
  f.submit({ action: PlayAction.Guo });
  await done;
  assert.equal(f.engine.players[0].timeBank, 17);
  done = f.discard();
  await flush();
  assert.equal(f.frames.filter((frame) => frame.type === RiichiMsg.ENtfPlayCard).at(-1).payload.userInfos[0].leftTimer, 17);
  t.mock.timers.tick(21_999);
  await flush();
  assert.equal(f.nextDraws.length, 1);
  t.mock.timers.tick(1);
  await done;
  assert.equal(f.engine.players[0].timeBank, 0);
  done = f.discard();
  await flush();
  t.mock.timers.tick(4_999);
  await flush();
  assert.equal(f.nextDraws.length, 2);
  t.mock.timers.tick(1);
  await done;
  assert.equal(f.nextDraws.length, 3);
});

test('三麻不下发吃且拒绝伪造吃请求，不能消耗已有碰牌窗口', async (t) => {
  const f = setup(t, 3);
  const done = f.discard();
  await flush();
  assert.equal(f.engine.claimActions(0, 2, f.card).includes(PlayAction.Chi), false);
  f.submit({ action: PlayAction.Chi, otherCards: f.used });
  assert.equal(f.frames.find((frame) => frame.type === RiichiMsg.ERspQiangCard).payload.result, Result.Fail_ActionNotInCanQiangActions);
  assert.ok(f.engine._pending);
  f.submit({ action: PlayAction.Peng, otherCards: f.used });
  await done;
  f.engine.players[0].hand = [221, 231, 211, 261, 281, 311, 331, 351, 371, 391, 411, 421, 431];
  f.engine.players[0].melds = [];
  f.engine.players[0].waits = [];
  assert.deepEqual(f.engine.claimActions(0, 2, 241), []);
});

test('四麻只有弃牌者下家可以吃，其他方位不能抢吃', (t) => {
  const f = setup(t, 4, PlayAction.Chi);
  assert.ok(f.engine.claimActions(0, 3, f.card).includes(PlayAction.Chi));
  assert.equal(f.engine.claimActions(0, 1, f.card).includes(PlayAction.Chi), false);
  assert.equal(f.engine.claimActions(0, 2, f.card).includes(PlayAction.Chi), false);
});

test('本次客户端明确开启不鸣才生效，关闭后恢复等待而不重置备用时间', async (t) => {
  const f = setup(t, 3);
  f.setting({ 2: 1 });
  await f.discard();
  assert.equal(f.nextDraws.length, 1);
  f.setting({ 2: 0 });
  const done = f.discard();
  await flush();
  t.mock.timers.tick(6_000);
  assert.ok(f.engine._pending);
  f.submit({ action: PlayAction.Guo });
  await done;
  assert.equal(f.engine.players[0].timeBank, 19);
});

test('重新绑定页面清除旧自动操作授权，但不删除历史设置或重置备用时间', async (t) => {
  const f = setup(t, 3);
  await import('../mock/proto.js');
  await import('../mock/data.js');
  await import('../mock/userdata.js');
  await import('../mock/server.js');
  const outer = globalThis.__mj.server.createSession();
  outer.riichi = f.session;
  const socket = { readyState: 1, _deliver() {} };
  outer.resume(socket);
  f.setting({ 2: 1, 3: 1 });
  outer.resume(socket);
  assert.equal(f.engine.internalState[2], true, '同一连接不重复清除授权');
  f.engine.players[0].timeBank = 7;
  outer.suspend();
  outer.resume({ readyState: 1, _deliver() {} });
  assert.equal(f.engine.internalState[2], false);
  assert.equal(f.engine.internalState[3], false);
  assert.equal(f.session.opts.internalState[2], 1);
  const done = f.discard();
  await flush();
  t.mock.timers.tick(11_999);
  await flush();
  assert.equal(f.nextDraws.length, 0);
  t.mock.timers.tick(1);
  await done;
  assert.equal(f.engine.players[0].timeBank, 0);
});

test('取消不鸣时，已经排队但尚未执行的自动过牌不得继续生效', async (t) => {
  const f = setup(t, 3);
  f.setting({ 2: 1 });
  f.engine.expectClaim(0, 2, f.card, [PlayAction.Peng, PlayAction.Guo]);
  const pending = f.engine.waitHuman('claim');
  f.setting({ 2: 0 });
  await flush();
  assert.ok(f.engine._pending, '取消自动过后恢复原窗口，不得执行旧微任务');
  t.mock.timers.tick(24_999);
  await flush();
  assert.ok(f.engine._pending);
  t.mock.timers.tick(1);
  assert.equal((await pending).action, PlayAction.Guo);
  assert.equal(f.engine.players[0].timeBank, 0);
});

test('客户端仅提交部分开关不能激活存档中其他自动动作', async (t) => {
  const f = setup(t, 3);
  f.setting({ 0: 1, 5: 1 });
  assert.equal(f.engine.internalState[1], false);
  assert.equal(f.engine.internalState[2], false);
  assert.equal(f.engine.internalState[5], true);
  const done = f.discard();
  await flush();
  assert.ok(f.engine._pending);
  f.submit({ action: PlayAction.Guo });
  await done;
});

test('出牌与鸣牌共用备用时间，仅下一小局恢复到 20 秒', async (t) => {
  const f = setup(t, 3);
  const p = f.engine.players[0];
  p.hand.push(471);
  p.drawnTile = 471;
  f.engine.expectDraw(0, true, [PlayAction.Normal], []);
  const draw = f.engine.waitHuman('draw');
  t.mock.timers.tick(9_000);
  assert.equal(f.engine.submitDraw({ action: PlayAction.Normal, card: 471 }), Result.Succ);
  await draw;
  assert.equal(p.timeBank, 16);
  p.hand.pop();
  p.drawnTile = null;
  const done = f.discard();
  await flush();
  t.mock.timers.tick(7_000);
  f.submit({ action: PlayAction.Guo });
  await done;
  assert.equal(p.timeBank, 14);
  f.engine.submitPrepare();
  await f.engine.runHand();
  assert.equal(f.engine.players[0].timeBank, 20);
  const start = f.frames.find((frame) => frame.type === RiichiMsg.ENtfGameStart).payload;
  assert.equal(start.defaultMinTimeout, 5);
  assert.equal(start.leftTimer, 20);
});

test('准备前提交的设置在惰性创建引擎后仍生效，但不夹带存档中的其他开关', (t) => {
  t.mock.method(GameEngine.prototype, 'start', async () => {});
  const session = new RiichiSession({ internalState: { 1: 1, 2: 1, 3: 1 } });
  t.after(() => session.stop());
  session.handleClient(RiichiMsg.EReqSetInternalState,
    encodeMsg('ReqSetInternalState', { InternalState: { 2: 1 } }));
  assert.equal(session.engine, null);
  const engine = session.ensureEngine();
  assert.equal(engine.internalState[2], true);
  assert.equal(engine.internalState[1], false);
  assert.equal(engine.internalState[3], false);
});

for (const [players, action, label] of [
  [3, PlayAction.Peng, '三麻碰'], [3, PlayAction.MingGang, '三麻明杠'],
  [4, PlayAction.Chi, '四麻吃'], [4, PlayAction.Peng, '四麻碰'], [4, PlayAction.MingGang, '四麻明杠'],
]) {
  test(`${label}：备用时间耗尽后仍等待完整 5 秒才推进下一家`, async (t) => {
    const f = setup(t, players, action, 0);
    const done = f.discard();
    await flush();
    t.mock.timers.tick(4_999);
    await flush();
    assert.equal(f.nextDraws.length, 0);
    assert.ok(f.engine._pending);
    t.mock.timers.tick(1);
    await done;
    assert.equal(f.nextDraws.length, 1);
    assert.equal(f.engine.players[0].melds.length, 0);
    assert.equal(f.engine.players[0].timeBank, 0);
  });
}
