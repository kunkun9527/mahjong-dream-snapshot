import test from 'node:test';
import assert from 'node:assert/strict';

import { GameEngine } from '../mockjs/engine.mjs';
import { chooseDiscard, handWaits, kindOf } from '../mockjs/ai.mjs';
import { PlayAction } from '../mockjs/proto_enum.mjs';

function player(seat, hand = []) {
  return {
    seat,
    isHuman: false,
    score: 25_000,
    timeBank: 0,
    hand: hand.slice(),
    melds: [],
    discards: [],
    discardClaimed: false,
    discardKinds: new Set(),
    riichi: false,
    doubleRiichi: false,
    riichiTurn: -1,
    riichiPending: false,
    ippatsu: false,
    menzen: true,
    waits: [],
    waitTiles: [],
    tempFuriten: false,
    riichiFuriten: false,
    drawnTile: hand.at(-1) ?? null,
    rinshan: false,
    pao: {},
  };
}

function engineWith(players) {
  const engine = new GameEngine({ players: players.length, speed: 0 });
  engine.players = players;
  engine.akaSet = new Set();
  engine.doraIndicators = [191];
  engine.uraIndicators = [];
  engine.remain = 20;
  engine.kanCount = 0;
  engine.roundWind = 1;
  engine.juNum = 0;
  engine.dealerSeat = 0;
  engine.xunNum = 1;
  return engine;
}

test('AI 明杠提交三张实体牌并可通过 resolveClaims 执行', async () => {
  const players = [
    player(0),
    player(1, [111, 112, 113, 211, 212, 213, 221, 222, 223, 231, 232, 233, 241]),
    player(2),
    player(3),
  ];
  players[0].discards.push(114);
  const engine = engineWith(players);
  engine.lastDiscard = { seat: 0, card: 114 };
  const actions = engine.claimActions(1, 0, 114);

  assert.deepEqual(actions, [PlayAction.MingGang, PlayAction.Peng, PlayAction.Guo]);
  assert.deepEqual(engine.aiClaim(1, 0, 114, actions), {
    action: PlayAction.MingGang,
    otherCards: [111, 112, 113],
  });

  let awaitedSeat = null;
  engine.drawReplacement = async () => true;
  engine.awaitTurn = async (seat) => { awaitedSeat = seat; };
  await engine.resolveClaims(0, 114, [[], actions, [], []]);

  assert.equal(awaitedSeat, 1);
  assert.deepEqual(players[1].melds, [{ type: 'kan', tiles: [111, 112, 113, 114], from: 0 }]);
  assert.equal(players[0].discards.length, 0);
});

test('三麻立直拔北只允许新摸的实体北牌', () => {
  const hand = [211, 221, 231, 241, 251, 261, 311, 321, 331, 351, 352, 441, 442, 291];
  const p = player(0, hand);
  p.riichi = true;
  p.riichiTurn = 1;
  p.drawnTile = 291;
  const engine = engineWith([p, player(1), player(2)]);
  engine.replacements = [451];

  assert.equal(engine.northInHand(p), null);
  assert.equal(engine.turnActions(0, true).includes(PlayAction.BaBei), false);

  p.hand[p.hand.length - 1] = 443;
  p.drawnTile = 443;
  assert.equal(engine.northInHand(p), 443);
  assert.equal(engine.turnActions(0, true).includes(PlayAction.BaBei), true);
  assert.deepEqual(engine.aiTurn(0, true, [PlayAction.Normal, PlayAction.BaBei]), {
    action: PlayAction.BaBei,
    card: 443,
  });

  p.riichi = false;
  assert.equal(engine.northInHand(p), 441);
});

test('筋食替只禁止所吃牌及对应的另一端', () => {
  const p = player(1, [111, 121, 131, 141, 151, 161]);
  const engine = engineWith([player(0), p, player(2), player(3)]);
  const cases = [
    { claimed: 111, meld: [111, 121, 131], expected: [110, 140] },
    { claimed: 141, meld: [121, 131, 141], expected: [110, 140] },
    { claimed: 131, meld: [121, 131, 141], expected: [130] },
    { claimed: 131, meld: [131, 141, 151], expected: [130, 160] },
  ];

  for (const { claimed, meld, expected } of cases) {
    engine.lastDiscard = { seat: 0, card: claimed };
    assert.deepEqual(engine.cantPlays(p, PlayAction.Chi, meld).sort((a, b) => a - b), expected);
  }
});

test('鸣牌后向听计算复用实际食替规则', () => {
  const p = player(1, [121, 141, 151, 211, 221, 231, 311, 321, 331, 411, 412, 451, 461]);
  const engine = engineWith([player(0), p, player(2), player(3)]);
  const claimed = 131;
  const used = [121, 141];
  engine.lastDiscard = { seat: 0, card: claimed };

  const afterHand = p.hand.filter((tile) => !used.includes(tile));
  const meld = { type: 'chi', tiles: [...used, claimed] };
  const forbiddenKinds = new Set([13]);
  const expected = chooseDiscard(afterHand, [meld], { forbiddenKinds }).shanten;
  let helperArgs = null;
  engine.kuikaeKinds = (...args) => {
    helperArgs = args;
    return forbiddenKinds;
  };

  assert.equal(engine.shantenAfterClaim(p, claimed, 'chi', used), expected);
  assert.deepEqual(helperArgs, [PlayAction.Chi, meld.tiles, claimed]);
});

test('弃牌选择在合法候选中计算准确的向听、受入与等待', () => {
  const hand = [141, 371, 142, 441, 161, 241, 381, 191, 431, 351, 111, 131, 171, 341];
  const legal = 371;
  const forbiddenKinds = new Set(hand.filter((tile) => tile !== legal).map(kindOf));
  const chosen = chooseDiscard(hand, [], { forbiddenKinds });
  const remaining = hand.filter((tile) => tile !== legal);
  const expected = handWaits(remaining, []);

  assert.equal(chosen.discardId, legal);
  assert.equal(chosen.shanten, expected.shanten);
  assert.equal(chosen.ukeire, expected.ukeire);
  assert.deepEqual(chosen.waits, expected.waits);
});
