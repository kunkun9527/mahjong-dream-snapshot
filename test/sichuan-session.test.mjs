import test from 'node:test';
import assert from 'node:assert/strict';
import { SichuanSession } from '../mockjs/sichuan_session.mjs';
import { chooseSichuanExchange, chooseSichuanMissingSuit, chooseSichuanDiscard } from '../mockjs/sichuan_ai.mjs';
import { buildSichuanWall } from '../mockjs/sichuan_hand.mjs';

function fakeClock() {
  let now = 100000;
  let nextId = 1;
  const active = new Map();
  const archived = new Map();
  const clock = {
    now: () => now,
    setTimeout(callback, delay) {
      const id = nextId++;
      active.set(id, { callback, due: now + delay });
      archived.set(id, callback);
      return id;
    },
    clearTimeout(id) { active.delete(id); },
  };
  function next() {
    const item = [...active].sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
    assert.ok(item, '活动会话必须有可推进的任务');
    const [id, job] = item;
    active.delete(id);
    now = Math.max(now, job.due);
    job.callback();
  }
  return { clock, active, archived, next,
    jump: (time) => { now += time; },
    tick(time) {
      const end = now + time;
      let count = 0;
      while ([...active.values()].some((job) => job.due <= end)) {
        assert.ok(count++ < 2000, '计时任务不可形成无限循环');
        next();
      }
      now = end;
    },
  };
}

const timeouts = { prepare: 200, exchange: 200, missing: 150, turn: 150, claim: 100 };
function setup(t, options = {}) {
  const timer = fakeClock();
  const errors = [];
  const session = new SichuanSession({ seed: 7, clock: timer.clock, aiDelayMs: 10, timeoutsMs: timeouts,
    onError: (error) => errors.push(error), ...options });
  t.after(() => { session.stop(); assert.deepEqual(errors, []); });
  assert.equal(session.start().ok, true);
  return { session, timer, errors };
}

function send(session, chosen) { return session.submit(chosen, session.view()); }
function manualChoice(view) {
  if (view.phase === 'exchange') return { type: 'exchange', tiles: chooseSichuanExchange(view.hand) };
  if (view.phase === 'missing') return { type: 'missing', tiles: [chooseSichuanMissingSuit(view.hand)] };
  if (view.phase === 'turn') return { type: 'discard', tiles: [chooseSichuanDiscard(view).tile] };
  return { type: 'pass', tiles: [] };
}
function advanceUntil(session, timer, predicate, maxSteps = 600) {
  for (let step = 0; step < maxSteps; step += 1) {
    const view = session.view();
    if (predicate(view)) return view;
    assert.equal(session.status, 'playing');
    if (view.options.length) assert.equal(send(session, manualChoice(view)).ok, true);
    else timer.next();
  }
  assert.fail('未抵达指定动作窗口');
}
function invariant(session) {
  const state = session.snapshot();
  const tiles = [...state.wall, ...state.robbedTiles, ...state.players.flatMap((player) => [
    ...player.hand, ...player.melds.flatMap((meld) => meld.tiles), ...player.river.filter((entry) => !entry.claimed).map((entry) => entry.tile),
  ])];
  assert.deepEqual(tiles.sort((a, b) => a - b), buildSichuanWall());
  assert.equal(state.scores.reduce((sum, score) => sum + score, 0), 0);
}

test('会话只准备开局一次，准备超时自动推进，停止取消全部任务', (t) => {
  const { session, timer } = setup(t);
  assert.equal(session.status, 'preparing');
  assert.deepEqual(session.start(), { ok: false, error: 'alreadyStarted' });
  assert.equal(send(session, { type: 'exchange', tiles: [] }).error, 'invalidPhase');
  timer.tick(199);
  assert.equal(session.status, 'preparing');
  timer.tick(1);
  assert.equal(session.status, 'playing');
  assert.equal(session.prepare(session.view().connectionId).error, 'invalidPhase');
  const callbacks = [...timer.archived.values()];
  session.stop();
  const before = session.snapshot();
  callbacks.forEach((callback) => callback());
  assert.equal(timer.active.size, 0);
  assert.deepEqual(session.snapshot(), before);
  assert.equal(session.result, null);
});

test('他家换牌不会重置真人截止时间，最后一毫秒提交有效且旧超时不能重复执行', (t) => {
  const { session, timer } = setup(t);
  assert.equal(session.prepare(session.view().connectionId).ok, true);
  const initial = session.view();
  const callbacks = [...timer.active.values()].map((job) => job.callback);
  timer.tick(199);
  assert.equal(session.view().expiresAt, initial.expiresAt);
  assert.equal(session.view().remainingMs, 1);
  const chosen = manualChoice(session.view());
  assert.equal(session.submit(chosen, initial).ok, true);
  assert.equal(session.view().phase, 'missing');
  const before = session.snapshot();
  callbacks.forEach((callback) => callback());
  assert.deepEqual(session.snapshot(), before);
  assert.equal(session.submit(chosen, initial).error, 'staleWindow');
});

test('事件循环迟到时仍拒绝超时请求，非法输入不变更状态也不续时', (t) => {
  const { session, timer } = setup(t);
  session.prepare(session.view().connectionId);
  const initial = session.view();
  const before = session.snapshot();
  assert.equal(send(session, { type: 'exchange', tiles: [111, 111, 111] }).ok, false);
  assert.deepEqual(session.snapshot(), before);
  assert.equal(session.view().expiresAt, initial.expiresAt);
  timer.jump(200); // 故意先前进时钟，不运行已到期回调。
  assert.equal(send(session, manualChoice(session.view())).error, 'expiredWindow');
  assert.deepEqual(session.snapshot(), before);
  timer.tick(0);
  assert.notEqual(session.view().phase, 'exchange');
  invariant(session);
});

test('同窗重复换牌仅接受一次，未收齐其他席前不交换任何实体牌', (t) => {
  const { session } = setup(t);
  session.prepare(session.view().connectionId);
  const initial = session.view();
  const hands = session.snapshot().players.map((player) => player.hand);
  const chosen = manualChoice(initial);
  assert.equal(session.submit(chosen, initial).ok, true);
  const accepted = session.snapshot();
  assert.equal(session.submit(chosen, initial).ok, false);
  assert.deepEqual(session.snapshot(), accepted);
  assert.deepEqual(accepted.players.map((player) => player.hand), hands);
});

test('换连接保留期限，旧消息、旧close与已出队的托管任务不能影响新连接', (t) => {
  const { session, timer } = setup(t);
  session.prepare(session.view().connectionId);
  const old = session.view();
  timer.tick(70);
  session.detach(old.connectionId);
  const takeover = [...timer.active.values()].map((job) => job.callback);
  const resumed = session.attach();
  assert.equal(resumed.ok, true);
  assert.equal(resumed.view.expiresAt, old.expiresAt);
  assert.equal(resumed.view.remainingMs, 130);
  assert.equal(resumed.view.autoplay, false);
  const before = session.snapshot();
  takeover.forEach((callback) => callback());
  assert.deepEqual(session.snapshot(), before);
  assert.equal(session.submit(manualChoice(resumed.view), old).error, 'staleConnection');
  assert.equal(session.detach(old.connectionId).error, 'staleConnection');
  assert.equal(session.view().connected, true);
  assert.equal(send(session, manualChoice(resumed.view)).ok, true);
});

test('主动托管与断线托管分离，反复切换不会刷新窗口时间或让AI重复响应', (t) => {
  const { session, timer } = setup(t);
  session.prepare(session.view().connectionId);
  const initial = session.view();
  assert.equal(session.setAutoplay(true, initial.connectionId).ok, true);
  assert.equal(send(session, manualChoice(initial)).error, 'autoplay');
  const oldAi = [...timer.active.values()].map((job) => job.callback);
  session.detach(initial.connectionId);
  const resumed = session.attach().view;
  assert.equal(resumed.autoplay, true, '主动托管不能因为重连被取消');
  session.setAutoplay(false, resumed.connectionId);
  oldAi.forEach((callback) => callback());
  assert.equal(session.view().expiresAt, initial.expiresAt);
  assert.equal(session.snapshot().exchanges[0], null);
  assert.equal(send(session, manualChoice(session.view())).ok, true);
});

test('换三张与定缺超时采用合法建议，出牌超时强制打缺而不是任意摸切', (t) => {
  const { session, timer } = setup(t, { seed: 1 });
  session.prepare(session.view().connectionId);
  timer.tick(200);
  assert.equal(session.view().phase, 'missing');
  timer.tick(150);
  const before = session.snapshot();
  assert.equal(before.phase, 'turn');
  assert.equal(before.turn, 0);
  const view = session.view();
  assert.ok(view.options.every((option) => option.type === 'discard'));
  const missing = before.players[0].missingSuit;
  const legal = view.options.map((option) => option.tiles[0]);
  assert.ok(legal.every((tile) => Math.floor(tile / 100) === missing));
  timer.tick(149);
  assert.deepEqual(session.snapshot(), before);
  timer.tick(1);
  const discard = session.snapshot().players[0].river.at(-1).tile;
  assert.ok(legal.includes(discard));
  invariant(session);
});

test('真人鸣牌窗口超时只过牌，AI席先回复不缩短真人期限', (t) => {
  const { session, timer } = setup(t, { seed: 1 });
  session.prepare(session.view().connectionId);
  const view = advanceUntil(session, timer, (state) => state.phase === 'claim' && state.options.length > 0);
  const before = session.snapshot();
  assert.equal(before.pending.responses[0], null);
  timer.tick(99);
  assert.equal(session.view().expiresAt, view.expiresAt);
  assert.equal(session.snapshot().pending.responses[0], null);
  timer.tick(1);
  const after = session.snapshot();
  assert.ok(after.windowId > before.windowId);
  assert.equal(after.players[0].melds.length, before.players[0].melds.length);
  assert.equal(after.players[0].won, before.players[0].won);
  invariant(session);
});

test('推送回调内立即回复合法动作不会被随后建立的旧计时任务覆盖', (t) => {
  let current;
  const { session, timer } = setup(t, { onUpdate: ({ reason, view }) => {
    if (current && reason === 'start') assert.equal(current.submit(manualChoice(view), view).ok, true);
  } });
  current = session;
  session.prepare(session.view().connectionId);
  assert.ok(session.snapshot().exchanges[0]);
  timer.tick(10);
  assert.equal(session.view().phase, 'missing');
  invariant(session);
});

test('本人更新与终局摘要均为隔离副本，不包含未来牌山或对手暗手', (t) => {
  const delivered = [];
  const { session, timer } = setup(t, { onUpdate: (update) => delivered.push(update) });
  session.prepare(session.view().connectionId);
  for (const update of delivered) {
    assert.ok(!('wall' in update.view) && !('players' in update.view) && !('events' in update.view));
    update.view.hand.length = 0;
    update.view.options.length = 0;
    update.view.scores[0] = 999;
  }
  assert.equal(session.view().hand.length, 14);
  assert.deepEqual(session.view().scores, [0, 0, 0, 0]);
  session.detach(session.view().connectionId);
  for (let step = 0; !session.matchOver && step < 1000; step += 1) timer.next();
  assert.equal(session.matchOver, true);
  assert.deepEqual(Object.keys(session.result).sort(), ['gameType', 'reason', 'rules', 'scores', 'seed', 'winners']);
  const result = session.result;
  result.scores[0] = 999;
  assert.notEqual(session.result.scores[0], 999);
});

test('断线接管四个真人座位及三类房间，逐动作守恒且每场只触发一次终局', { timeout: 120000 }, (t) => {
  for (const [index, rules] of [
    { exchange: true, topBei: 128 }, { exchange: true, topBei: 256 }, { exchange: false, topBei: 256 },
    { exchange: true, topBei: 128 },
  ].entries()) {
    let finishes = 0;
    const { session, timer } = setup(t, { seed: index + 1, humanSeat: index, ...rules,
      onFinish: () => { finishes += 1; } });
    session.detach(session.view().connectionId); // 准备期断线也必须自行收尾。
    for (let step = 0; !session.matchOver && step < 1000; step += 1) { timer.next(); invariant(session); }
    assert.equal(session.matchOver, true);
    assert.equal(finishes, 1);
    assert.equal(timer.active.size, 0);
    const final = session.snapshot();
    for (const callback of timer.archived.values()) callback();
    assert.equal(finishes, 1);
    assert.deepEqual(session.snapshot(), final);
    assert.equal(session.attach().error, 'inactiveSession');
    assert.equal(session.prepare(session.view().connectionId).ok, false);
    assert.equal(session.start().ok, false);
  }
});

test('外部推送或终局回调抛错不重复结算，也不遗留超时任务', () => {
  const timer = fakeClock();
  const errors = [];
  let finished = 0;
  const session = new SichuanSession({ seed: 3, clock: timer.clock, aiDelayMs: 0,
    onUpdate: () => { throw new Error('mock 推送失败'); },
    onFinish: () => { finished += 1; throw new Error('mock 结算接线失败'); },
    onError: (error) => errors.push(error.message) });
  try {
    session.start();
    session.detach(session.view().connectionId);
    for (let step = 0; !session.matchOver && step < 1000; step += 1) timer.next();
    assert.equal(session.matchOver, true);
    assert.equal(finished, 1);
    assert.equal(errors.filter((message) => message === 'mock 结算接线失败').length, 1);
    assert.equal(timer.active.size, 0);
    invariant(session);
  } finally { session.stop(); }
});

test('无效的座位、计时配置与回调在创建计时任务前拒绝', () => {
  for (const options of [{ humanSeat: 4 }, { aiDelayMs: -1 }, { timeoutsMs: { claim: 0 } },
    { timeoutsMs: { bogus: 1 } }, { timeoutsMs: [] }, { onFinish: null }, { clock: { now: 0 } }]) {
    assert.throws(() => new SichuanSession(options));
  }
});
