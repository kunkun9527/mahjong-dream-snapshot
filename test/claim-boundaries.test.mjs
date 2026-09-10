import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../mockjs/engine.mjs';
import { PlayAction, Result } from '../mockjs/proto_enum.mjs';

function player(seat, hand = [], melds = []) {
  return {
    seat, isHuman: seat === 0, score: 25_000, timeBank: 20,
    hand: hand.slice(), melds: structuredClone(melds), discards: [],
    discardKinds: new Set(), discardClaimed: false, riichi: false,
    riichiTurn: -1, riichiPending: false, doubleRiichi: false,
    ippatsu: false, menzen: melds.length === 0, waits: [], waitTiles: [],
    tempFuriten: false, riichiFuriten: false, drawnTile: null, rinshan: false, pao: {},
  };
}

const openMelds = [
  { type: 'chi', tiles: [211, 221, 231], from: 3 },
  { type: 'chi', tiles: [311, 321, 331], from: 3 },
  { type: 'pon', tiles: [451, 452, 453], from: 3 },
];

function fixture(hand, melds = openMelds, card = 111) {
  const engine = new GameEngine({ players: 4, speed: 0 });
  engine.players = [player(0, hand, melds), player(1), player(2), player(3)];
  engine.players[3].discards = [card];
  engine.players[3].discardKinds.add(Math.floor(card / 10));
  engine.lastDiscard = { seat: 3, card };
  engine.remain = 20;
  engine.xunNum = 5;
  engine.firstGoAround = false;
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.updateWaits(engine.players[0]);
  return engine;
}

function expectedClaim(engine, card = 111) {
  return { seat: 0, discarderSeat: 3, card, actions: engine.claimActions(0, 3, card) };
}

function gameState(engine) {
  return structuredClone({ players: engine.players, lastDiscard: engine.lastDiscard,
    processing: engine._processing, kanCount: engine.kanCount });
}

test('吃牌后无合法弃牌时不提供吃动作，拒绝请求且不修改牌局', async () => {
  const engine = fixture([121, 131, 141, 142]);
  const p = engine.players[0];
  assert.deepEqual(engine.chiOptions(p, 111), []);
  assert.equal(engine.claimActions(0, 3, 111).includes(PlayAction.Chi), false);
  const before = gameState(engine);
  assert.notEqual(engine.validateClaimPayload({ action: PlayAction.Chi, otherCards: [121, 131] }, expectedClaim(engine)), Result.Succ);
  assert.notEqual(await engine.executeClaim(0, PlayAction.Chi, 111, 3, [121, 131]), Result.Succ);
  assert.deepEqual(gameState(engine), before);
});

test('即使动作列表含吃，也必须按提交的实体牌检查鸣牌后能否弃牌', () => {
  const engine = fixture([121, 131, 141, 142]);
  const expected = { seat: 0, discarderSeat: 3, card: 111, actions: [PlayAction.Chi, PlayAction.Guo] };
  const before = gameState(engine);
  assert.equal(engine.validateClaimPayload({ action: PlayAction.Chi, otherCards: [121, 131] }, expected), Result.Fail_InvalidOtherCards);
  assert.deepEqual(gameState(engine), before);
});

test('合法吃牌仍能进入弃牌窗口并保留实体牌与食替限制', async () => {
  const engine = fixture([121, 131, 141, 441]);
  let turn;
  engine.awaitTurn = async (seat, drew) => { turn = { seat, drew }; };
  assert.equal(await engine.executeClaim(0, PlayAction.Chi, 111, 3, [121, 131]), Result.Succ);
  assert.deepEqual(turn, { seat: 0, drew: false });
  assert.deepEqual(engine.players[0].hand, [141, 441]);
  assert.deepEqual(engine.players[0].melds.at(-1).tiles, [111, 121, 131]);
  assert.deepEqual(engine._expectedDraw.cantPlays, [140]);
  assert.equal(engine.players[3].discards.length, 0);
});

test('有荣和机会却选择吃或碰，必须记录同巡振听', async () => {
  for (const scenario of [
    { hand: [121, 131, 441, 442], card: 111, action: PlayAction.Chi, used: [121, 131] },
    { hand: [111, 112, 441, 442], card: 113, action: PlayAction.Peng, used: [111, 112] },
  ]) {
    const engine = fixture(scenario.hand, openMelds, scenario.card);
    const can = engine.claimActions(0, 3, scenario.card);
    assert.ok(can.includes(PlayAction.Hu));
    assert.ok(can.includes(scenario.action));
    engine.waitHuman = async () => ({ action: scenario.action, otherCards: scenario.used });
    engine.awaitTurn = async () => {};
    await engine.resolveClaims(3, scenario.card, [can, [], [], []]);
    assert.equal(engine.players[0].tempFuriten, true);
    assert.equal(engine.players[0].riichiFuriten, false);
  }
});

test('自己的副露与暗手凑齐四张等待牌，不得算听第五张的形式听牌', () => {
  const engine = fixture([114]);
  const melds = [{ type: 'pon', tiles: [111, 112, 113], from: 1 }, ...openMelds];
  assert.equal(engine.isFormalTenpaiHand([114], melds), false);
  assert.equal(engine.isFormalTenpaiHand([191], melds), true);
  // 两面等待的两端都被自己的暗杠占满，也不存在可完成的牌形。
  const kans = [
    { type: 'ankan', tiles: [111, 112, 113, 114] },
    { type: 'ankan', tiles: [141, 142, 143, 144] },
    openMelds[2],
  ];
  assert.equal(engine.isFormalTenpaiHand([121, 131, 441, 442], kans), false);
  assert.equal(engine.isFormalTenpaiHand([121, 131, 441, 442], [kans[0], ...openMelds.slice(1)]), true);
});
