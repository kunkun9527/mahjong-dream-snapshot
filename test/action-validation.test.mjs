import test from 'node:test';
import assert from 'node:assert/strict';

import { GameEngine } from '../mockjs/engine.mjs';
import { chooseDiscard, kindOf } from '../mockjs/ai.mjs';
import { Result, PlayAction } from '../mockjs/proto_enum.mjs';
import { tileId } from '../mockjs/tiles.mjs';

function player(seat, hand = []) {
  return {
    seat,
    isHuman: seat === 0,
    score: 25_000,
    timeBank: 0,
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

function engineWith(players) {
  const engine = new GameEngine({ players: players.length, speed: 0 });
  engine.players = players;
  engine.remain = 50;
  engine.kanCount = 0;
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  return engine;
}

test('未下发的自摸动作会被拒绝且不消费等待状态', () => {
  const hand = [1, 2, 3, 4].map((copy) => tileId(1, 1, copy));
  const engine = engineWith([player(0, hand), player(1), player(2), player(3)]);
  engine.expectDraw(0, true, [PlayAction.Normal], []);

  const result = engine.submitDraw({ action: PlayAction.Riichi, card: hand[0] });
  assert.equal(result, Result.Fail_ActionNotInCanPlayActions);
  assert.equal(engine._expectedDraw.actions[0], PlayAction.Normal);
  assert.deepEqual(engine.players[0].hand, hand);
});

test('暗杠必须提交实际的四张同种牌', () => {
  const quad = [1, 2, 3, 4].map((copy) => tileId(1, 1, copy));
  const wrong = tileId(2, 2, 1);
  const engine = engineWith([player(0, [...quad, wrong]), player(1), player(2), player(3)]);
  engine.expectDraw(0, true, [PlayAction.Normal, PlayAction.AnGang], []);

  assert.equal(engine.submitDraw({ action: PlayAction.AnGang, card: wrong }), Result.Fail_CardNotMatchAction);
  assert.deepEqual(engine.players[0].hand, [...quad, wrong]);
});

test('非法吃牌不会先移除供牌者牌河', async () => {
  const claimed = tileId(1, 1, 1);
  const two = tileId(1, 2, 1);
  const three = tileId(1, 3, 1);
  const hand = [two, three, 151, 161, 211, 221, 231, 311, 321, 331, 411, 412, 441];
  const players = [player(0), player(1, hand), player(2), player(3)];
  players[0].discards.push(claimed);
  const engine = engineWith(players);
  engine.lastDiscard = { seat: 0, card: claimed };

  const result = await engine.executeClaim(1, PlayAction.Chi, claimed, 0, [two, two]);
  assert.equal(result, Result.Fail_InvalidOtherCards);
  assert.deepEqual(players[0].discards, [claimed]);
  assert.deepEqual(players[1].hand, hand);
  assert.deepEqual(players[1].melds, []);
});

test('过荣振听区分同巡与立直后永久状态', () => {
  const p = player(0);
  p.waits = [11];
  const engine = engineWith([p, player(1), player(2), player(3)]);

  engine.markPassedRon(p);
  assert.equal(p.tempFuriten, true);
  assert.deepEqual(engine.furitenTypes(p), [1]);

  p.tempFuriten = false;
  p.riichi = true;
  engine.markPassedRon(p);
  assert.equal(p.riichiFuriten, true);
  assert.deepEqual(engine.furitenTypes(p), [0]);
});

test('弃牌评估不会选择食替禁止牌', () => {
  const hand = [
    tileId(1, 1, 1), tileId(1, 2, 1), tileId(1, 3, 1),
    tileId(2, 2, 1), tileId(2, 3, 1), tileId(2, 4, 1),
    tileId(3, 2, 1), tileId(3, 3, 1), tileId(3, 4, 1),
    tileId(4, 1, 1), tileId(4, 1, 2), tileId(4, 5, 1),
    tileId(4, 6, 1), tileId(4, 7, 1),
  ];
  const forbidden = new Set(hand.slice(0, -1).map(kindOf));
  const chosen = chooseDiscard(hand, [], { forbiddenKinds: forbidden });
  assert.equal(chosen.discardId, hand.at(-1));
});

test('立直后只允许不改变等待牌种的摸入暗杠', () => {
  const hand13 = [
    tileId(1, 1, 1), tileId(1, 1, 2), tileId(1, 1, 3),
    tileId(1, 2, 1), tileId(1, 3, 1), tileId(1, 4, 1),
    tileId(2, 5, 1), tileId(2, 6, 1), tileId(2, 7, 1),
    tileId(3, 7, 1), tileId(3, 8, 1), tileId(3, 9, 1),
    tileId(2, 2, 1),
  ];
  const drawn = tileId(1, 1, 4);
  const p = player(0, hand13);
  p.riichi = true;
  const engine = engineWith([p, player(1), player(2), player(3)]);
  assert.deepEqual(engine.riichiFutureAnkanKinds(p), [110]);

  p.hand.push(drawn);
  p.drawnTile = drawn;
  assert.equal(kindOf(engine.concealedQuadTile(p)), kindOf(drawn));
  assert.equal(engine.turnActions(0, true).includes(PlayAction.AnGang), true);
});

test('加杠被抢时不会提前修改手牌、副露或杠数', async () => {
  const engine = new GameEngine({ players: 4, speed: 0 });
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.deadWall = [];
  engine.remain = 30;
  engine.kanCount = 0;
  engine.players = [0, 1, 2, 3].map((seat) => player(seat));
  const card = tileId(2, 5, 4);
  engine.players[0].hand = [card];
  engine.players[0].melds = [{
    type: 'pon',
    tiles: [1, 2, 3].map((copy) => tileId(2, 5, copy)),
    from: 1,
  }];
  engine.kanRobActions = () => [[], [PlayAction.Hu, PlayAction.Guo], [], []];
  engine.resolveKanRob = async () => {
    assert.deepEqual(engine.players[0].hand, [card]);
    assert.equal(engine.players[0].melds[0].type, 'pon');
    assert.equal(engine.players[0].melds[0].tiles.length, 3);
    assert.equal(engine.kanCount, 0);
    return true;
  };
  await engine.doKan(0, card, 'kakan');
  assert.deepEqual(engine.players[0].hand, [card]);
  assert.equal(engine.players[0].melds[0].type, 'pon');
  assert.equal(engine.kanCount, 0);
});

test('暗杠只有国士无双可以抢杠', () => {
  const engine = new GameEngine({ players: 4 });
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.remain = 30;
  engine.players = [0, 1, 2, 3].map((seat) => player(seat));
  const kokushi = engine.players[1];
  kokushi.hand = [
    [1, 9], [2, 1], [2, 9], [3, 1], [3, 9],
    [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7],
    [1, 9],
  ].map(([suit, rank], index) => tileId(suit, rank, index % 4 + 1));
  kokushi.waits = [11];
  assert.equal(engine.canRobKan(kokushi, tileId(1, 1, 1), 'ankan'), true);
});

test('真人出牌超时自动摸切，鸣牌超时自动跳过', async () => {
  const drawn = tileId(2, 5, 1);
  const engine = new GameEngine({ players: 4, baseTime: 0.01, extraTime: 0 });
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.players = [player(0, [drawn]), player(1), player(2), player(3)];
  engine.players[0].drawnTile = drawn;
  engine.expectDraw(0, true, [PlayAction.Normal]);
  assert.deepEqual(await engine.waitHuman('draw'), { action: PlayAction.Normal, card: drawn });
  engine.players[0].drawnTile = null;
  engine.players[0].hand = [tileId(1, 1, 1), tileId(1, 2, 1), tileId(1, 3, 1), tileId(4, 1, 1)];
  engine.expectDraw(0, false, [PlayAction.Normal], [440]);
  const afterClaimTimeout = engine.timeoutHumanAction('draw');
  assert.equal(afterClaimTimeout.action, PlayAction.Normal);
  assert.ok(engine.players[0].hand.includes(afterClaimTimeout.card));
  engine.expectClaim(0, 1, tileId(3, 3, 1), [PlayAction.Hu, PlayAction.Guo]);
  assert.deepEqual(await engine.waitHuman('claim'), { action: PlayAction.Guo, otherCards: [] });
});

test('自动和牌与跳过鸣牌状态会直接执行', async () => {
  const engine = new GameEngine({ players: 4, baseTime: 5, extraTime: 20 });
  engine.players = [player(0), player(1), player(2), player(3)];
  engine.setInternalState({ 1: 1, 2: 1 });
  engine.expectClaim(0, 1, tileId(3, 3, 1), [PlayAction.Hu, PlayAction.Guo]);
  assert.deepEqual(await engine.waitHuman('claim'), { action: PlayAction.Hu });
  engine.setInternalState({ 1: 0 });
  engine.expectClaim(0, 1, tileId(3, 3, 2), [PlayAction.Peng, PlayAction.Guo]);
  assert.deepEqual(await engine.waitHuman('claim'), { action: PlayAction.Guo, otherCards: [] });
});

test('拔北被抢时不会提前移除北牌或增加拔北副露', async () => {
  const north = tileId(4, 4, 1);
  const engine = new GameEngine({ players: 3, speed: 0 });
  engine.players = [player(0, [north]), player(1), player(2)];
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.kanRobActions = () => [];
  engine.canRon = (candidate) => candidate.seat === 1;
  engine.resolveKanRob = async (_seat, _tile, actions, extra) => {
    assert.deepEqual(actions, [[], [PlayAction.Hu, PlayAction.Guo], []]);
    assert.deepEqual(extra, {});
    assert.deepEqual(engine.players[0].hand, [north]);
    assert.equal(engine.players[0].melds.length, 0);
    return true;
  };
  await engine.doBaBei(0, north);
  assert.deepEqual(engine.players[0].hand, [north]);
  assert.equal(engine.players[0].melds.length, 0);
});

test('页面断开后 AI 会立即接管正在等待的真人动作', async () => {
  const drawn = tileId(3, 6, 1);
  const engine = new GameEngine({ players: 4, baseTime: 5, extraTime: 20 });
  engine.players = [player(0, [drawn]), player(1), player(2), player(3)];
  engine.players[0].drawnTile = drawn;
  engine.expectDraw(0, true, [PlayAction.Normal]);
  const pending = engine.waitHuman('draw');
  engine.setHumanAutoplay(true);
  assert.deepEqual(await pending, { action: PlayAction.Normal, card: drawn });
  engine.setHumanAutoplay(false);
  assert.equal(engine.autoHuman, false);
});

test('形式听牌允许无役和场上空听，但手持四张单骑等待牌不算听牌', () => {
  const makeRun = (suit, ranks) => ranks.map((rank) => tileId(suit, rank, 1));
  const deadSingle = [
    ...[1, 2, 3, 4].map((copy) => tileId(1, 1, copy)),
    ...makeRun(2, [2, 3, 4]),
    ...makeRun(2, [5, 6, 7]),
    ...makeRun(3, [7, 8, 9]),
  ];
  const engine = engineWith([player(0, deadSingle), player(1), player(2), player(3)]);
  assert.equal(engine.isTenpai(engine.players[0]), false);

  const ordinary = [
    ...makeRun(1, [2, 3, 4]),
    ...makeRun(1, [5, 6, 7]),
    ...makeRun(2, [2, 3, 4]),
    ...makeRun(3, [6, 7, 8]),
    tileId(4, 1, 1),
  ];
  engine.players[0].hand = ordinary;
  assert.equal(engine.isTenpai(engine.players[0]), true);
});

test('暗杠立即翻杠宝，加杠延迟到弃牌或下一次杠前', async () => {
  const indicator1 = tileId(2, 1, 1);
  const indicator2 = tileId(2, 2, 1);
  const setup = (engine) => {
    engine.deadWall = new Array(14).fill(0);
    engine.deadWall[4] = indicator1;
    engine.deadWall[5] = tileId(3, 1, 1);
    engine.deadWall[6] = indicator2;
    engine.deadWall[7] = tileId(3, 2, 1);
    engine.doraIndicators = [indicator1];
    engine.uraIndicators = [engine.deadWall[5]];
    engine._deferredKanDora = 0;
    engine.resolveKanRob = async () => false;
    engine.drawReplacement = async () => false;
  };

  const quad = [1, 2, 3, 4].map((copy) => tileId(1, 1, copy));
  const ankan = engineWith([player(0, quad), player(1), player(2), player(3)]);
  setup(ankan);
  await ankan.doKan(0, quad[0], 'ankan');
  assert.equal(ankan.doraIndicators.length, 2);
  assert.equal(ankan._deferredKanDora, 0);

  const added = tileId(1, 2, 4);
  const kakan = engineWith([player(0, [added]), player(1), player(2), player(3)]);
  kakan.players[0].melds = [{ type: 'pon', tiles: [1, 2, 3].map((copy) => tileId(1, 2, copy)), from: 1 }];
  setup(kakan);
  await kakan.doKan(0, added, 'kakan');
  assert.equal(kakan.doraIndicators.length, 1);
  assert.equal(kakan._deferredKanDora, 1);
  kakan.flushDeferredKanDora();
  assert.equal(kakan.doraIndicators.length, 2);
  assert.equal(kakan._deferredKanDora, 0);
});
