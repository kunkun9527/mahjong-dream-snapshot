import test from 'node:test';
import assert from 'node:assert/strict';
import { SichuanSession } from '../mockjs/sichuan_session.mjs';
import { SichuanOpeningNotifications } from '../mockjs/sichuan_opening_notifications.mjs';
import { MaJiangAction, MaJiangMsg, decodeMaJiangEnvelope } from '../mockjs/majiang_pb.mjs';
import { chooseSichuanExchange, chooseSichuanMissingSuit } from '../mockjs/sichuan_ai.mjs';
import { buildSichuanWall } from '../mockjs/sichuan_hand.mjs';

const seats = [0, 1, 2, 3];
const context = () => ({ gameID: 'mock-sichuan-opening', userIds: [10001, 10002, 10003, 10004],
  initialScores: [100000, 200000, 300000, 400000], scoreType: 1 });

function fakeClock() {
  let now = 100000;
  let sequence = 0;
  const jobs = new Map();
  return {
    clock: { now: () => now,
      setTimeout(callback, delay) { const id = ++sequence; jobs.set(id, { callback, due: now + delay }); return id; },
      clearTimeout(id) { jobs.delete(id); },
    },
    next() {
      const item = [...jobs].sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
      assert.ok(item, '开局尚未完成时必须有计时任务');
      const [id, job] = item;
      jobs.delete(id);
      now = Math.max(now, job.due);
      job.callback();
    },
  };
}

function setup(t, options = {}, info = context()) {
  const timer = fakeClock();
  const frames = [];
  const errors = [];
  let projection;
  let collect = true;
  const session = new SichuanSession({ seed: 7, aiDelayMs: 10, clock: timer.clock, ...options,
    onUpdate() { if (collect) frames.push(...projection.read()); },
    onError(error) { errors.push(error); },
  });
  projection = new SichuanOpeningNotifications(session, info);
  t.after(() => { session.stop(); assert.deepEqual(errors, []); });
  return { session, projection, frames, timer, collect: (enabled) => { collect = enabled; } };
}

function choose(session) {
  const view = session.view();
  const chosen = view.phase === 'exchange' ? { type: 'exchange', tiles: chooseSichuanExchange(view.hand) }
    : { type: 'missing', tiles: [chooseSichuanMissingSuit(view.hand)] };
  assert.equal(session.submit(chosen, view).ok, true);
}

function finishOpening(run, { manual = true } = {}) {
  for (let step = 0; !run.projection.complete && step < 30; step += 1) {
    if (manual && run.session.view().options.length) choose(run.session);
    else run.timer.next();
  }
  assert.equal(run.projection.complete, true);
  assert.equal(run.session.view().phase, 'turn');
}

function decodedFrames(frames) {
  return frames.map((frame) => {
    const decoded = decodeMaJiangEnvelope(frame.bytes);
    assert.equal(decoded.name, frame.name);
    assert.equal(decoded.cmd, MaJiangMsg[`E${frame.name}`]);
    assert.equal(decoded.gameNumber, '0');
    assert.deepEqual(decoded.extraLogicData, []);
    return decoded;
  });
}

const only = (frames, name) => {
  const selected = frames.filter((frame) => frame.name === name);
  assert.equal(selected.length, 1, `${name}只能出现一次`);
  return selected[0].payload;
};

test('准备、开局、换牌、定缺通知完整有序，原协议信封可逐帧解码', (t) => {
  const run = setup(t);
  assert.deepEqual(run.projection.read(), []);
  run.session.start();
  run.session.prepare(run.session.view().connectionId);
  finishOpening(run);
  const frames = decodedFrames(run.frames);
  assert.deepEqual(frames.map((frame) => frame.name), [
    'NtfToPrepare', ...seats.map(() => 'NtfPrepare'), 'NtfGameStart',
    ...seats.map(() => 'NtfChangeCard'), 'NtfChangeCardEnd',
    ...seats.map(() => 'NtfDingQue'), 'NtfDingQueEnd',
  ]);
  assert.deepEqual(only(frames, 'NtfToPrepare').userInfos.map((entry) => [entry.seat, entry.userID]),
    context().userIds.map((id, seat) => [seat, String(id)]));
  assert.deepEqual(frames.filter((frame) => frame.name === 'NtfPrepare').map((frame) => frame.payload.seat), seats);
  for (const frame of frames) assert.deepEqual(frame.payload.userInfos.map((entry) => entry.seat), seats);
  assert.equal(frames.some((frame) => frame.name === 'NtfSendCard'), false);
});

test('发牌只显示本人实体牌，他家保留13张或庄家14张背牌且不泄漏建议', (t) => {
  for (const humanSeat of seats) {
    const run = setup(t, { humanSeat, dealer: 2 });
    const before = run.session.snapshot();
    run.session.start();
    run.session.prepare(run.session.view().connectionId);
    const start = only(decodedFrames(run.frames), 'NtfGameStart');
    assert.equal(start.remainDuiCardNum, 55);
    assert.equal(start.zhuangSeat, 2);
    assert.deepEqual(start.userInfos.map((entry) => entry.score), context().initialScores.map(String));
    for (const entry of start.userInfos) {
      assert.deepEqual(entry.handCards, entry.seat === humanSeat ? before.players[humanSeat].hand
        : Array(entry.seat === 2 ? 14 : 13).fill(0));
      assert.deepEqual(entry.changeCardSuggest, entry.seat === humanSeat ? chooseSichuanExchange(entry.handCards) : []);
      assert.deepEqual(entry.canPlayActions, []);
      assert.equal(entry.dingQueSuggest, 0);
    }
    assert.deepEqual(run.session.snapshot(), before, '通知投影不能移动牌山或消耗引擎随机数');
  }
});

test('三种换牌方向与四个真人座位均能按通知重建正确手牌，他家只收到等量背牌', (t) => {
  const directions = new Set();
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
    for (const humanSeat of seats) {
      const run = setup(t, { seed, humanSeat });
      run.session.start();
      run.session.prepare(run.session.view().connectionId);
      finishOpening(run);
      const state = run.session.snapshot();
      directions.add(state.exchangeOffset);
      const frames = decodedFrames(run.frames);
      const start = only(frames, 'NtfGameStart');
      assert.equal(start.changeCardType, { 1: 2, 2: 3, 3: 1 }[state.exchangeOffset]);
      const end = only(frames, 'NtfChangeCardEnd');
      for (const entry of end.userInfos) {
        const hand = [...start.userInfos[entry.seat].handCards];
        assert.equal(entry.cards.length, 3);
        assert.equal(entry.getCards.length, 3);
        for (const tile of entry.cards) {
          const index = hand.indexOf(tile);
          assert.notEqual(index, -1, '换出牌必须存在于客户端当前手牌');
          hand.splice(index, 1);
        }
        hand.push(...entry.getCards);
        const own = entry.seat === humanSeat;
        assert.deepEqual(hand.sort((a, b) => a - b), own ? [...state.players[entry.seat].hand].sort((a, b) => a - b)
          : Array(state.players[entry.seat].hand.length).fill(0));
        assert.deepEqual(entry.getCards, own ? state.exchanges[(humanSeat - state.exchangeOffset + 4) % 4] : [0, 0, 0]);
        assert.equal(entry.dingQueSuggest, own ? chooseSichuanMissingSuit(state.players[humanSeat].hand) : 0);
      }
      for (const frame of frames.filter((frame) => frame.name === 'NtfChangeCard')) {
        assert.equal(frame.payload.cardNum, 3);
        for (const entry of frame.payload.userInfos) {
          assert.deepEqual(entry.cards, entry.seat === humanSeat && frame.payload.seat === humanSeat ? state.exchanges[humanSeat] : []);
        }
      }
    }
  }
  assert.deepEqual([...directions].sort(), [1, 2, 3]);
});

test('定缺逐人确认不泄漏他家花色，收齐后统一公开且仅庄家本人获得合法操作', (t) => {
  for (const humanSeat of seats) {
    const run = setup(t, { humanSeat, dealer: 2 });
    run.session.start();
    run.session.prepare(run.session.view().connectionId);
    finishOpening(run);
    const frames = decodedFrames(run.frames);
    const state = run.session.snapshot();
    for (const frame of frames.filter((frame) => frame.name === 'NtfDingQue')) {
      for (const entry of frame.payload.userInfos) {
        assert.equal(entry.dingQue, entry.seat === humanSeat && frame.payload.seat === humanSeat ? state.players[humanSeat].missingSuit : 0);
      }
    }
    for (const entry of only(frames, 'NtfDingQueEnd').userInfos) {
      assert.equal(entry.dingQue, state.players[entry.seat].missingSuit);
      assert.deepEqual(entry.canPlayActions, entry.seat === humanSeat && humanSeat === 2 ? [MaJiangAction.Normal] : []);
      assert.equal(entry.moCard, 0, '庄家第14张已发过，定缺结束不可重复发牌');
    }
  }
});

test('不换牌房间直接定缺，合法暗杠和天胡按钮沿用原动作枚举', (t) => {
  const hand = [111, 112, 113, 114, 121, 131, 141, 151, 161, 171, 181, 191, 221, 222];
  const others = buildSichuanWall().filter((tile) => !hand.includes(tile));
  const wall = [...hand.slice(0, 13), ...others.slice(0, 39), hand[13], ...others.slice(39)];
  const run = setup(t, { wall, exchange: false, topBei: 256 });
  run.session.start();
  run.session.prepare(run.session.view().connectionId);
  const start = only(decodedFrames(run.frames), 'NtfGameStart');
  assert.equal(start.changeCardRule, 0);
  assert.equal(start.changeCardType, 0);
  assert.equal(start.userInfos[0].dingQueSuggest, 3);
  finishOpening(run);
  const frames = decodedFrames(run.frames);
  assert.ok(!frames.some((frame) => frame.name.startsWith('NtfChangeCard')));
  assert.deepEqual(only(frames, 'NtfDingQueEnd').userInfos[0].canPlayActions,
    [MaJiangAction.Normal, MaJiangAction.Hu, MaJiangAction.AnGang]);
});

test('计时按秒向上取整且不假造共享延长时间，超时配置 getter 返回隔离副本', (t) => {
  const run = setup(t, { timeoutsMs: { exchange: 20001, missing: 15001, turn: 9001, claim: 7001 } });
  run.session.timeoutsMs.turn = 1;
  run.session.start();
  run.session.prepare(run.session.view().connectionId);
  const start = only(decodedFrames(run.frames), 'NtfGameStart');
  assert.deepEqual([start.huanZhangTimeout, start.dingQueTimeout, start.chuPai1Timeout, start.qiangPaiTimeout], [21, 16, 10, 8]);
  assert.ok(start.userInfos.every((entry) => entry.chuPai2Timeout === 0));
  assert.equal(run.session.view().remainingMs, 20001);
});

test('重复读取、托管切换和连接替换不重发开局，也不刷新真人动作期限', (t) => {
  const run = setup(t);
  run.session.start();
  assert.deepEqual(run.projection.read(), []);
  run.session.prepare(run.session.view().connectionId);
  const count = run.frames.length;
  const deadline = run.session.view().expiresAt;
  run.session.setAutoplay(true, run.session.view().connectionId);
  run.session.setAutoplay(false, run.session.view().connectionId);
  run.session.detach(run.session.view().connectionId);
  run.session.attach();
  assert.equal(run.frames.length, count);
  assert.equal(run.session.view().expiresAt, deadline);
  assert.deepEqual(run.projection.read(), []);
  finishOpening(run);
  const finalCount = run.frames.length;
  run.session.setAutoplay(true, run.session.view().connectionId);
  run.timer.next();
  assert.equal(run.frames.length, finalCount, '开局投影完成后不能混入摸打通知');
});

test('准备和换牌定缺全部超时仍发送完整开局链，真人最后提交不丢四座位结束通知', (t) => {
  const run = setup(t);
  run.session.start();
  run.timer.next(); // 准备超时。
  finishOpening(run, { manual: false });
  const frames = decodedFrames(run.frames);
  assert.equal(frames.filter((frame) => frame.name === 'NtfChangeCard').at(-1).payload.seat, 0);
  assert.equal(frames.filter((frame) => frame.name === 'NtfDingQue').at(-1).payload.seat, 0);
  assert.equal(only(frames, 'NtfChangeCardEnd').userInfos.length, 4);
  assert.equal(only(frames, 'NtfDingQueEnd').userInfos.length, 4);
});

test('返回数据及传入桌面资料可修改而不会污染后续通知或权威状态', (t) => {
  const info = context();
  const run = setup(t, {}, info);
  info.userIds.fill(99);
  info.initialScores.fill(99);
  info.gameID = 'changed';
  run.session.start();
  run.frames[0].payload.userInfos[0].userID = 99;
  run.session.prepare(run.session.view().connectionId);
  const start = only(run.frames, 'NtfGameStart');
  assert.equal(start.gameID, context().gameID);
  assert.deepEqual(start.userInfos.map((entry) => entry.score), context().initialScores);
  start.userInfos[0].handCards.length = 0;
  start.userInfos[0].changeCardSuggest.length = 0;
  assert.equal(run.session.view().hand.length, 14);
  finishOpening(run);
  assert.equal(only(run.frames, 'NtfChangeCardEnd').userInfos[0].cards.length, 3);
});

test('遗漏准备或多次状态更新时明确报错，不拿当前手牌补造过时历史', (t) => {
  const run = setup(t);
  run.collect(false);
  run.session.start();
  run.session.prepare(run.session.view().connectionId);
  assert.throws(() => run.projection.read(), /遗漏准备/);
  const second = setup(t);
  second.session.start();
  second.session.prepare(second.session.view().connectionId);
  second.collect(false);
  choose(second.session);
  second.timer.next();
  assert.throws(() => second.projection.read(), /遗漏状态更新/);
  assert.throws(() => second.projection.read(), /遗漏状态更新/, '失败不应推进投影游标');
});

test('中途停止后不补发迟到开局，创建时拒绝缺失资料或已启动会话', (t) => {
  const run = setup(t);
  for (const info of [undefined, { ...context(), gameID: '' }, { ...context(), userIds: [1, 1, 2, 3] },
    { ...context(), initialScores: [1, 2, 3] }, { ...context(), scoreType: -1 }]) {
    assert.throws(() => new SichuanOpeningNotifications(run.session, info));
  }
  assert.throws(() => new SichuanOpeningNotifications({}, context()));
  run.session.start();
  assert.throws(() => new SichuanOpeningNotifications(run.session, context()), /启动前/);
  run.session.stop();
  assert.deepEqual(run.projection.read(), []);
  assert.equal(run.projection.complete, false);
  assert.deepEqual(run.frames.map((frame) => frame.name), ['NtfToPrepare']);
});
