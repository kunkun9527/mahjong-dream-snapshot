import test from 'node:test';
import assert from 'node:assert/strict';

import { GameEngine } from '../mockjs/engine.mjs';
import { Result, PlayAction } from '../mockjs/proto_enum.mjs';
import { tileId } from '../mockjs/tiles.mjs';

function player(seat, hand = []) {
  return {
    seat,
    isHuman: seat === 0,
    score: 25_000,
    timeBank: 20,
    hand: hand.slice(),
    melds: [],
    discards: [],
    discardKinds: new Set(),
    riichi: false,
    riichiTurn: -1,
    ippatsu: false,
    menzen: true,
    waits: [],
    tempFuriten: false,
    riichiFuriten: false,
    drawnTile: hand.at(-1) ?? null,
    rinshan: false,
  };
}

function engineWith(players, options = {}) {
  const engine = new GameEngine({ players: players.length, speed: 0, ...options });
  engine.players = players;
  engine.remain = 50;
  engine.kanCount = 0;
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.handEnded = false;
  return engine;
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function claimEngine() {
  const players = [player(0), player(1), player(2), player(3)];
  const engine = engineWith(players);
  const card = tileId(3, 3, 1);
  const actions = [[PlayAction.Hu, PlayAction.Guo], [], [], []];
  engine.expectClaim(0, 1, card, actions[0]);
  return { engine, players, card, actions };
}

test('awaitTurn 延迟期间断线后由 AI 接管且清理输入窗口', async () => {
  const drawn = tileId(2, 5, 1);
  const engine = engineWith([player(0, [drawn]), player(1), player(2), player(3)], { baseTime: 0, extraTime: 0 });
  engine.players[0].timeBank = 0;
  const gate = deferred();
  let aiCalls = 0;
  let processed;
  engine._d = () => gate.promise;
  engine.turnActions = () => [PlayAction.Normal];
  engine.canJiuZhongJiuPai = () => false;
  engine.aiTurn = () => { aiCalls++; return { action: PlayAction.Normal, card: drawn }; };
  engine.processTurnAction = async (...args) => { processed = args; return Result.Succ; };

  const turn = engine.awaitTurn(0, true, false);
  assert.ok(engine._expectedDraw);
  engine.setHumanAutoplay(true);
  gate.resolve();
  await turn;

  assert.equal(aiCalls, 1);
  assert.equal(processed[1], PlayAction.Normal);
  assert.equal(processed[2], drawn);
  assert.equal(engine._expectedDraw, null);
  assert.equal(engine.submitDraw({ action: PlayAction.Normal, card: drawn }), Result.Fail_InvalidSequence);
  assert.equal(engine._bufferedDraw, null);
});

test('awaitTurn 延迟期间重连后补建输入窗口并等待真人', async () => {
  const drawn = tileId(2, 6, 1);
  const engine = engineWith([player(0, [drawn]), player(1), player(2), player(3)], { autoHuman: true });
  const gate = deferred();
  let aiCalls = 0;
  let processed;
  engine._d = () => gate.promise;
  engine.turnActions = () => [PlayAction.Normal];
  engine.canJiuZhongJiuPai = () => false;
  engine.aiTurn = () => { aiCalls++; return { action: PlayAction.Normal, card: drawn }; };
  engine.processTurnAction = async (...args) => { processed = args; return Result.Succ; };

  const turn = engine.awaitTurn(0, true, false);
  assert.equal(engine._expectedDraw, null);
  engine.setHumanAutoplay(false);
  gate.resolve();
  await Promise.resolve();

  assert.ok(engine._expectedDraw);
  assert.equal(engine.submitDraw({ action: PlayAction.Normal, card: drawn }), Result.Succ);
  await turn;
  assert.equal(aiCalls, 0);
  assert.equal(processed[2], drawn);
  assert.equal(engine._expectedDraw, null);
});

test('awaitTurn 保留延迟期间已接受的唯一真人输入且不污染下巡', async () => {
  const drawn = tileId(2, 7, 1);
  const engine = engineWith([player(0, [drawn]), player(1), player(2), player(3)]);
  const gate = deferred();
  let aiCalls = 0;
  let processed;
  engine._d = () => gate.promise;
  engine.turnActions = () => [PlayAction.Normal];
  engine.canJiuZhongJiuPai = () => false;
  engine.aiTurn = () => { aiCalls++; return { action: PlayAction.Normal, card: drawn }; };
  engine.processTurnAction = async (...args) => { processed = args; return Result.Succ; };

  const turn = engine.awaitTurn(0, true, false);
  assert.equal(engine.submitDraw({ action: PlayAction.Normal, card: drawn }), Result.Succ);
  assert.notEqual(engine._bufferedDraw, null);
  engine.setHumanAutoplay(true);
  gate.resolve();
  await turn;

  assert.equal(aiCalls, 0);
  assert.equal(processed[2], drawn);
  assert.equal(engine._bufferedDraw, null);
  assert.equal(engine._expectedDraw, null);
  assert.equal(engine.submitDraw({ action: PlayAction.Normal, card: drawn }), Result.Fail_InvalidSequence);
  assert.equal(engine._bufferedDraw, null);
});

test('托管完成 pending 后重复提交失败且 waitHuman 不遗留计时器', async () => {
  const drawn = tileId(1, 8, 1);
  const engine = engineWith([player(0, [drawn]), player(1), player(2), player(3)], { baseTime: 5, extraTime: 20 });
  engine.players[0].drawnTile = drawn;
  engine.expectDraw(0, true, [PlayAction.Normal]);
  const pending = engine.waitHuman('draw');
  engine.setHumanAutoplay(true);
  assert.deepEqual(await pending, { action: PlayAction.Normal, card: drawn });
  assert.equal(engine._expectedDraw, null);
  assert.equal(engine.submitDraw({ action: PlayAction.Normal, card: drawn }), Result.Fail_InvalidSequence);
  assert.equal(engine._bufferedDraw, null);

  engine._expectedDraw = { seat: 0, drew: true, actions: [PlayAction.Normal], cantPlays: [] };
  const automatic = engine.waitHuman('draw');
  try {
    assert.equal(engine._pending?.timer, null);
    assert.deepEqual(await automatic, { action: PlayAction.Normal, card: drawn });
  } finally {
    engine.cancelPending();
  }
});

test('resolveClaims 等待中切托管后真人过和不会再由 AI 胡牌', async () => {
  const { engine, players, card, actions } = claimEngine();
  let winners = null;
  engine.aiClaim = (seat) => seat === 0 ? { action: PlayAction.Hu } : null;
  engine.winRons = async (seats) => { winners = seats; };
  engine.turnDraw = async () => {};

  const resolving = engine.resolveClaims(1, card, actions);
  engine.setHumanAutoplay(true);
  await resolving;

  assert.equal(players[0].tempFuriten, true);
  assert.equal(winners, null);
  assert.equal(engine._expectedClaim, null);
});

test('resolveClaims 真人胡牌后切托管不会生成重复赢家', async () => {
  const { engine, card, actions } = claimEngine();
  let winners = null;
  engine.aiClaim = (seat) => seat === 0 ? { action: PlayAction.Hu } : null;
  engine.winRons = async (seats) => { winners = seats; };

  const resolving = engine.resolveClaims(1, card, actions);
  assert.equal(engine.submitClaim({ action: PlayAction.Hu }), Result.Succ);
  engine.setHumanAutoplay(true);
  await resolving;

  assert.deepEqual(winners, [0]);
  assert.equal(engine._expectedClaim, null);
  assert.equal(engine._bufferedClaim, null);
});

test('resolveClaims 保留等待前已接受的真人过和输入', async () => {
  const { engine, players, card, actions } = claimEngine();
  let winners = null;
  engine.aiClaim = (seat) => seat === 0 ? { action: PlayAction.Hu } : null;
  engine.winRons = async (seats) => { winners = seats; };
  engine.turnDraw = async () => {};

  assert.equal(engine.submitClaim({ action: PlayAction.Guo }), Result.Succ);
  assert.notEqual(engine._bufferedClaim, null);
  engine.setHumanAutoplay(true);
  await engine.resolveClaims(1, card, actions);

  assert.equal(players[0].tempFuriten, true);
  assert.equal(winners, null);
  assert.equal(engine._bufferedClaim, null);
  assert.equal(engine._expectedClaim, null);
});

test('AI 转回真人时 resolveKanRob 补建输入窗口', async () => {
  const { engine, card, actions } = claimEngine();
  engine.setHumanAutoplay(true);
  engine._expectedClaim = null;
  engine.setHumanAutoplay(false);
  let winners = null;
  engine.winRons = async (seats) => { winners = seats; };

  const resolving = engine.resolveKanRob(1, card, actions);
  assert.ok(engine._expectedClaim);
  assert.equal(engine.submitClaim({ action: PlayAction.Hu }), Result.Succ);
  assert.equal(await resolving, true);
  assert.deepEqual(winners, [0]);
  assert.equal(engine._expectedClaim, null);
});

test('resolveKanRob 等待中切托管后过和不再胡，真人胡不重复', async () => {
  {
    const { engine, players, card, actions } = claimEngine();
    let winners = null;
    engine.winRons = async (seats) => { winners = seats; };
    const resolving = engine.resolveKanRob(1, card, actions);
    engine.setHumanAutoplay(true);
    assert.equal(await resolving, false);
    assert.equal(players[0].tempFuriten, true);
    assert.equal(winners, null);
    assert.equal(engine._expectedClaim, null);
  }
  {
    const { engine, card, actions } = claimEngine();
    let winners = null;
    engine.winRons = async (seats) => { winners = seats; };
    const resolving = engine.resolveKanRob(1, card, actions);
    assert.equal(engine.submitClaim({ action: PlayAction.Hu }), Result.Succ);
    engine.setHumanAutoplay(true);
    assert.equal(await resolving, true);
    assert.deepEqual(winners, [0]);
    assert.equal(engine._expectedClaim, null);
    assert.equal(engine._bufferedClaim, null);
  }
});
