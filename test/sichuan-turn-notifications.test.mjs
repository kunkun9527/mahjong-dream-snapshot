import test from 'node:test';
import assert from 'node:assert/strict';
import { SichuanEngine } from '../mockjs/sichuan_engine.mjs';
import { SichuanSession } from '../mockjs/sichuan_session.mjs';
import { buildSichuanWall } from '../mockjs/sichuan_hand.mjs';
import { buildSichuanDrawNotification, buildSichuanDiscardNotification } from '../mockjs/sichuan_turn_notifications.mjs';
import { MaJiangAction as Action, MaJiangMsg, decodeMaJiangEnvelope } from '../mockjs/majiang_pb.mjs';

const seats = [0, 1, 2, 3];
const act = (type, tiles = []) => ({ type, tiles });
const types = (options) => [...new Set(options.map((option) => option.type))];
const waiting = [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29];

function submit(engine, seat, chosen) {
  assert.ok(chosen, '必须存在所需的合法动作');
  assert.equal(engine.submit(seat, chosen, engine.windowId).ok, true);
}

function rig({ hands = [[], [], [], []], extra = 29, draws = [], tail = [], missing = [3, 3, 3, 3] } = {}) {
  const pool = buildSichuanWall();
  const take = (kind) => {
    const index = pool.findIndex((tile) => Math.floor(tile / 10) === kind);
    assert.notEqual(index, -1, `不能使用第五张${kind}`);
    return pool.splice(index, 1)[0];
  };
  const initial = hands.map((hand) => hand.map(take));
  const additional = take(extra);
  const head = draws.map(take);
  const end = tail.map(take);
  for (const hand of initial) while (hand.length < 13) hand.push(pool.shift());
  const engine = new SichuanEngine({ exchange: false, topBei: 256,
    wall: [...initial.flat(), additional, ...head, ...pool, ...end] });
  for (const seat of seats) submit(engine, seat, act('missing', [missing[seat]]));
  return engine;
}

function discardKind(engine, kind) {
  const seat = engine.snapshot().turn;
  submit(engine, seat, engine.legalActions(seat).find((option) => option.type === 'discard'
    && Math.floor(option.tiles[0] / 10) === kind));
}

function passAll(engine) {
  const windowId = engine.windowId;
  for (const seat of seats) {
    if (engine.phase === 'claim' && engine.windowId === windowId && engine.legalActions(seat).length) {
      submit(engine, seat, act('pass'));
    }
  }
}

function decoded(frame) {
  const value = decodeMaJiangEnvelope(frame.bytes);
  assert.equal(frame.cmd, MaJiangMsg[`E${frame.name}`]);
  assert.equal(value.name, frame.name);
  assert.equal(value.gameNumber, '0');
  assert.deepEqual(value.extraLogicData, []);
  assert.deepEqual(value.payload.userInfos.map((row) => row.seat), seats);
  return value.payload;
}

function lastPair(engine) {
  const events = engine.snapshot().events;
  const event = events.findLast((item) => item.type === 'discard');
  assert.ok(event);
  return [event, events[event.index + 1]];
}

function firstDraw(options = {}) {
  const engine = rig({ extra: 31, ...options });
  discardKind(engine, 31);
  passAll(engine);
  assert.equal(engine.snapshot().turn, 1);
  return engine;
}

function addedKongGame() {
  const engine = rig({ hands: [[11], [11, 11, 11, 12, 13, 14, 21, 22, 23, 24, 25, 26, 29], [], []],
    extra: 19, missing: [1, 3, 3, 1], draws: [31, 32, 33, 34] });
  discardKind(engine, 11);
  submit(engine, 1, engine.legalActions(1).find((option) => option.type === 'pon'));
  passAll(engine);
  assert.equal(engine.snapshot().turnSource, 'pon');
  return engine;
}

test('摸牌通知按四座位排列，仅本人看到摸入实体牌和按钮，不泄漏他家暗牌与候选', () => {
  const engine = firstDraw({ hands: [[], waiting, [], []], draws: [29] });
  const event = engine.snapshot().events.at(-1);
  assert.equal(event.type, 'draw');
  assert.deepEqual(event.actionTypes, types(engine.legalActions(1)));
  assert.ok(event.actionTypes.includes('hu'));
  const before = engine.snapshot();
  for (const humanSeat of seats) {
    const frame = buildSichuanDrawNotification(event, humanSeat);
    const payload = decoded(frame);
    assert.equal(frame.eventIndex, event.index);
    assert.equal(payload.seat, 1);
    assert.equal(payload.remainDuiCardNum, 54);
    for (const row of payload.userInfos) {
      assert.equal(row.card, row.seat === 1 && humanSeat === 1 ? event.tile : 0);
      assert.deepEqual(row.canPlayActions, row.seat === 1 && humanSeat === 1 ? [Action.Normal, Action.Hu] : []);
      assert.deepEqual(row.tingInfos, []);
      assert.equal(row.chuPai2Timeout, 0);
    }
    if (humanSeat !== 1) {
      const changedHidden = { ...event, tile: 391, actionTypes: ['discard', 'ankan'] };
      assert.deepEqual(buildSichuanDrawNotification(changedHidden, humanSeat).bytes, frame.bytes);
    }
  }
  assert.deepEqual(engine.snapshot(), before);
});

test('摸牌时暗杠和补杠按钮来自当时权威候选，而不是补发时的新状态', () => {
  const concealed = firstDraw({ hands: [[], [11, 11, 11], [], []], draws: [11] });
  const event = concealed.snapshot().events.at(-1);
  assert.ok(decoded(buildSichuanDrawNotification(event, 1)).userInfos[1].canPlayActions.includes(Action.AnGang));
  const added = addedKongGame();
  discardKind(added, 29);
  passAll(added);
  for (let step = 0; added.snapshot().turn !== 1; step += 1) {
    assert.ok(step < 4);
    const seat = added.snapshot().turn;
    submit(added, seat, added.legalActions(seat).find((option) => option.type === 'discard'));
    passAll(added);
  }
  const draw = added.snapshot().events.at(-1);
  assert.ok(draw.actionTypes.includes('kakan'));
  const saved = buildSichuanDrawNotification(draw, 1).bytes;
  submit(added, 1, added.legalActions(1).find((option) => option.type === 'kakan'));
  passAll(added);
  assert.deepEqual(buildSichuanDrawNotification(draw, 1).bytes, saved);
  assert.ok(decoded(buildSichuanDrawNotification(draw, 1)).userInfos[1].canPlayActions.includes(Action.PengGang));
});

test('出牌通知公开弃牌但只给本人碰胡候选，可胡不能提前标记完成或结算', () => {
  const engine = rig({ hands: [[], waiting, [29, 29], []], missing: [2, 3, 3, 1] });
  discardKind(engine, 29);
  const [event, claim] = lastPair(engine);
  assert.equal(engine.phase, 'claim');
  assert.ok(claim.actionTypes[1].includes('hu'));
  assert.ok(claim.actionTypes[2].includes('pon'));
  for (const seat of seats) assert.deepEqual(claim.actionTypes[seat], types(engine.legalActions(seat)));
  const before = engine.snapshot();
  for (const humanSeat of seats) {
    const payload = decoded(buildSichuanDiscardNotification(event, claim, humanSeat));
    assert.equal(payload.card, event.tile);
    assert.equal(payload.seat, event.seat);
    assert.equal(payload.action, Action.Normal);
    assert.equal(payload.isFinish, false);
    assert.deepEqual(payload.moneyLogs, []);
    const map = { pass: Action.Guo, hu: Action.Hu, pon: Action.Peng, kan: Action.MingGang };
    for (const row of payload.userInfos) {
      assert.deepEqual(row.canQiangActions, row.seat === humanSeat ? claim.actionTypes[row.seat].map((type) => map[type]) : []);
      assert.equal(row.canQiangActions.includes(Action.Chi), false);
    }
  }
  assert.deepEqual(engine.snapshot(), before);
});

test('持有三张可同时碰或明杠，事件按钮去重且不下发其他座位的候选实体', () => {
  const engine = rig({ hands: [[11], [11, 11, 11], [], []], missing: [1, 3, 3, 3] });
  discardKind(engine, 11);
  const [event, claim] = lastPair(engine);
  assert.ok(engine.legalActions(1).filter((option) => option.type === 'pon').length > 1);
  assert.equal(claim.actionTypes[1].filter((type) => type === 'pon').length, 1);
  const own = decoded(buildSichuanDiscardNotification(event, claim, 1));
  assert.ok(own.userInfos[1].canQiangActions.includes(Action.Peng));
  assert.ok(own.userInfos[1].canQiangActions.includes(Action.MingGang));
  const hidden = decoded(buildSichuanDiscardNotification(event, claim, 2));
  assert.deepEqual(hidden.userInfos[1].canQiangActions, []);
});

test('抢牌事件保留窗口最初候选，部分响应、全部过牌和下一次摸牌不篡改历史通知', () => {
  const engine = rig({ hands: [[], waiting, [29, 29], []], missing: [2, 3, 3, 1] });
  discardKind(engine, 29);
  const [event, claim] = lastPair(engine);
  const bytes = buildSichuanDiscardNotification(event, claim, 1).bytes;
  submit(engine, 1, act('pass'));
  assert.deepEqual(engine.legalActions(1), []);
  assert.deepEqual(buildSichuanDiscardNotification(...lastPair(engine), 1).bytes, bytes);
  passAll(engine);
  assert.equal(engine.phase, 'turn');
  assert.deepEqual(buildSichuanDiscardNotification(...lastPair(engine), 1).bytes, bytes);
  const changed = decoded(buildSichuanDiscardNotification(event, claim, 1));
  changed.userInfos[1].canQiangActions.length = 0;
  assert.deepEqual(buildSichuanDiscardNotification(event, claim, 1).bytes, bytes);
});

test('摸切按精确实体判定，同牌种旧牌、庄家初手与碰后弃牌均不冒充摸切', () => {
  const engine = firstDraw({ hands: [[], waiting, [], []], draws: [29] });
  const state = engine.snapshot();
  const old = state.players[1].hand.find((tile) => Math.floor(tile / 10) === 29 && tile !== state.drawnTile);
  assert.ok(old);
  submit(engine, 1, act('discard', [old]));
  assert.equal(decoded(buildSichuanDiscardNotification(...lastPair(engine), 1)).isMoQie, false);
  const fresh = firstDraw({ hands: [[], waiting, [], []], draws: [29] });
  submit(fresh, 1, act('discard', [fresh.snapshot().drawnTile]));
  assert.equal(decoded(buildSichuanDiscardNotification(...lastPair(fresh), 1)).isMoQie, true);
  const initial = rig();
  submit(initial, 0, act('discard', [initial.snapshot().drawnTile]));
  assert.equal(lastPair(initial)[0].isMoQie, false);
  const pon = addedKongGame();
  discardKind(pon, 29);
  assert.equal(lastPair(pon)[0].isMoQie, false);
});

test('杠后补牌记录实际尾部实体和余牌数，补牌摸切不重复增加基础计时', () => {
  const engine = rig({ hands: [[11, 11, 11, 11], [], [], []], tail: [39] });
  submit(engine, 0, engine.legalActions(0).find((option) => option.type === 'ankan'));
  const draw = engine.snapshot().events.at(-1);
  assert.equal(draw.source, 'kong');
  assert.equal(Math.floor(draw.tile / 10), 39);
  const payload = decoded(buildSichuanDrawNotification(draw, 0));
  assert.equal(payload.remainDuiCardNum, 54);
  assert.equal(payload.userInfos[0].card, draw.tile);
  assert.equal(payload.userInfos[0].chuPai2Timeout, 0);
  submit(engine, 0, act('discard', [draw.tile]));
  assert.equal(lastPair(engine)[0].isMoQie, true);
});

test('已定缺的牌不提供碰杠胡，没人可抢时先出牌后摸牌且通知不虚构过牌按钮', () => {
  const engine = rig({ hands: [[11], [11, 11, 11], [], []], missing: [1, 1, 1, 1] });
  const start = engine.snapshot().events.length;
  discardKind(engine, 11);
  const events = engine.snapshot().events.slice(start);
  assert.deepEqual(events.map((event) => event.type), ['discard', 'claimWindow', 'claimPassed', 'draw']);
  const discard = decoded(buildSichuanDiscardNotification(events[0], events[1], 1));
  assert.ok(discard.userInfos.every((row) => row.canQiangActions.length === 0));
  assert.equal(decoded(buildSichuanDrawNotification(events[3], 1)).seat, 1);
});

test('错配窗口、抢补杠冒充弃牌、非法实体、座位及未知动作均明确拒绝', () => {
  const engine = firstDraw();
  const [event, claim] = lastPair(engine);
  const draw = engine.snapshot().events.at(-1);
  for (const bad of [{ ...claim, index: claim.index + 1 }, { ...claim, from: 2 }, { ...claim, tile: 999 },
    { ...claim, kind: 'added' }, { ...claim, actionTypes: [[], [], []] },
    { ...claim, actionTypes: [[], ['pass', 'chi'], [], []] }]) {
    assert.throws(() => buildSichuanDiscardNotification(event, bad, 0));
  }
  for (const bad of [{ ...draw, type: 'start' }, { ...draw, tile: 110 }, { ...draw, remaining: -1 },
    { ...draw, seat: 4 }, { ...draw, actionTypes: ['discard', 'constructor'] },
    { ...draw, actionTypes: ['discard', 'discard'] }, { ...draw, actionTypes: ['hu'] }]) {
    assert.throws(() => buildSichuanDrawNotification(bad, 0));
  }
  for (const seat of [-1, 4, 0.5, '0']) assert.throws(() => buildSichuanDrawNotification(draw, seat));
  assert.throws(() => buildSichuanDiscardNotification({ ...event, isMoQie: undefined }, claim, 0));
});

test('三个固定种子无鸣牌单局逐帧重建四种本人视角，手牌数量与实体均和权威状态一致', () => {
  let draws = 0;
  let discards = 0;
  for (const seed of [7, 19, 31]) {
    const engine = new SichuanEngine({ seed, exchange: false, topBei: 256 });
    for (const seat of seats) submit(engine, seat, act('missing', [3]));
    const initial = engine.snapshot();
    const models = seats.map((viewer) => initial.players.map((player, seat) => seat === viewer ? [...player.hand] : player.hand.map(() => 0)));
    for (let step = 0; engine.phase !== 'ended'; step += 1) {
      assert.ok(step < 300);
      const start = engine.snapshot().events.length;
      if (engine.phase === 'claim') passAll(engine);
      else {
        const seat = engine.snapshot().turn;
        submit(engine, seat, engine.legalActions(seat).find((option) => option.type === 'discard'));
      }
      const state = engine.snapshot();
      for (const event of state.events.slice(start)) {
        if (event.type === 'draw') draws += 1;
        if (event.type === 'discard') discards += 1;
        if (!['draw', 'discard'].includes(event.type)) continue;
        for (const viewer of seats) {
          const payload = decoded(event.type === 'draw' ? buildSichuanDrawNotification(event, viewer)
            : buildSichuanDiscardNotification(event, state.events[event.index + 1], viewer));
          const hand = models[viewer][payload.seat];
          if (event.type === 'draw') hand.push(payload.userInfos[payload.seat].card);
          else {
            const index = hand.indexOf(payload.seat === viewer ? payload.card : 0);
            assert.notEqual(index, -1, '不能移除手里不存在的实体或背牌');
            hand.splice(index, 1);
          }
          if (event.type === 'draw' && event.remaining === 0) {
            assert.ok(payload.userInfos.every((row) => !row.canPlayActions.includes(Action.AnGang) && !row.canPlayActions.includes(Action.PengGang)));
          }
        }
      }
      for (const viewer of seats) {
        assert.deepEqual(models[viewer].map((hand) => hand.length), state.players.map((player) => player.hand.length));
        assert.deepEqual([...models[viewer][viewer]].sort(), [...state.players[viewer].hand].sort());
      }
    }
    assert.equal(engine.snapshot().endReason, 'wall');
  }
  assert.equal(draws, 55 * 3);
  assert.equal(discards, 56 * 3);
});

test('真实会话逐次更新可构造摸打通知而不推进计时，缺失裁决通知不得视为完整UI接线', (t) => {
  let now = 0;
  let id = 0;
  const jobs = new Map();
  const errors = [];
  const captured = [];
  let cursor = 0;
  let session;
  session = new SichuanSession({ seed: 7, aiDelayMs: 10, timeoutsMs: { turn: 12345, claim: 8765 },
    clock: { now: () => now,
      setTimeout(callback, delay) { jobs.set(++id, { callback, due: now + delay }); return id; },
      clearTimeout(key) { jobs.delete(key); } },
    onError: (error) => errors.push(error),
    onUpdate() {
      const state = session.snapshot();
      const before = session.view();
      for (const event of state.events.slice(cursor)) {
        if (event.type === 'draw') captured.push(buildSichuanDrawNotification(event, before.seat));
        if (event.type === 'discard') captured.push(buildSichuanDiscardNotification(event, state.events[event.index + 1], before.seat));
      }
      cursor = state.events.length;
      assert.deepEqual(session.snapshot(), state);
      assert.deepEqual(session.view(), before);
      // 此处只测试构造器；没有向客户端发送，未把碰杠胡/终局事件伪装成已适配。
    },
  });
  t.after(() => session.stop());
  session.start();
  session.prepare(session.view().connectionId);
  for (let step = 0; !session.matchOver; step += 1) {
    assert.ok(step < 1000);
    const [key, job] = [...jobs].sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
    jobs.delete(key);
    now = job.due;
    job.callback();
  }
  assert.deepEqual(errors, []);
  assert.ok(captured.some((frame) => frame.name === 'NtfSendCard'));
  assert.ok(captured.some((frame) => frame.name === 'NtfPlayCard'));
  assert.equal(new Set(captured.map((frame) => frame.eventIndex)).size, captured.length);
  for (const frame of captured) decoded(frame);
});
