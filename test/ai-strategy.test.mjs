import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';

import { GameEngine } from '../mockjs/engine.mjs';
import { PlayAction } from '../mockjs/proto_enum.mjs';
import { tileId } from '../mockjs/tiles.mjs';

function makeTiles(groups) {
  const copies = new Map();
  return groups.flatMap(([suit, ranks]) => ranks.map((rank) => {
    const key = suit * 10 + rank;
    const copy = (copies.get(key) || 0) + 1;
    copies.set(key, copy);
    return tileId(suit, rank, copy);
  }));
}

function makePlayer(seat, hand = [], score = 25_000) {
  return {
    seat,
    isHuman: false,
    score,
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

function makeEngine(players) {
  const engine = new GameEngine({ players: players.length, speed: 0 });
  engine.players = players;
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.roundWind = 1;
  engine.juNum = 0;
  engine.dealerSeat = 0;
  engine.remain = 40;
  engine.xunNum = 8;
  return engine;
}

test('防守模型把现物判为零风险，并降低筋与壁外侧风险', () => {
  const players = [makePlayer(0), makePlayer(1), makePlayer(2), makePlayer(3)];
  players[1].riichi = true;
  players[1].discardKinds = new Set([15, 19]);
  players[1].discards = [tileId(1, 5, 1), tileId(1, 9, 1)];
  players[2].discards = [1, 2, 3, 4].map((copy) => tileId(1, 2, copy));
  const engine = makeEngine(players);
  const danger = engine.dangerKinds(0);

  assert.equal(danger.riskByKind.get(15), 0);
  assert.ok(danger.riskByKind.get(12) < danger.riskByKind.get(14));
  assert.ok(danger.riskByKind.get(16) < danger.riskByKind.get(14));
});

test('AI 不为无役路线开门，但会碰役牌', () => {
  const hand = makeTiles([
    [1, [2, 2, 5, 5, 8]],
    [2, [1, 4, 7]],
    [3, [2, 6]],
    [4, [1, 2, 3]],
  ]);
  const players = [makePlayer(0), makePlayer(1, hand), makePlayer(2), makePlayer(3)];
  const engine = makeEngine(players);
  const p = players[1];

  assert.equal(engine.worthOpening(p, tileId(1, 5, 3), 'pon'), false);
  assert.equal(engine.worthOpening(p, tileId(4, 5, 1), 'pon'), true);
});

test('All Last 大幅领先且默听有役时选择默听而非立直', () => {
  const hand = makeTiles([
    [1, [1, 2, 3, 4, 5, 6, 7, 8, 9]],
    [2, [2, 3, 9]],
    [3, [5, 5]],
  ]);
  const players = [makePlayer(0, hand, 42_000), makePlayer(1, [], 24_000), makePlayer(2, [], 18_000), makePlayer(3, [], 16_000)];
  const engine = makeEngine(players);
  engine.juNum = 3;
  engine.players[0].drawnTile = tileId(2, 9, 1);

  const decision = engine.aiTurn(0, true, [PlayAction.Normal, PlayAction.Riichi]);
  assert.equal(decision.action, PlayAction.Normal);
  assert.equal(Math.floor(decision.card / 10), 29);
});

test('AI 决策确定且远低于两秒硬预算', () => {
  const hand = makeTiles([
    [1, [1, 2, 3, 4, 6]],
    [2, [2, 3, 5, 7, 8]],
    [3, [3, 4, 9]],
    [4, [1]],
  ]);
  const players = [makePlayer(0, hand), makePlayer(1), makePlayer(2), makePlayer(3)];
  players[1].riichi = true;
  players[1].discardKinds = new Set([11, 18, 44]);
  players[1].discards = [tileId(1, 1, 4), tileId(1, 8, 4), tileId(4, 4, 4)];
  const engine = makeEngine(players);
  const start = performance.now();
  const decisions = Array.from({ length: 30 }, () => engine.aiTurn(0, true, [PlayAction.Normal]));
  const elapsed = performance.now() - start;

  assert.ok(decisions.every((decision) => decision.action === decisions[0].action && decision.card === decisions[0].card));
  assert.ok(elapsed < 2_000, `30 次决策耗时 ${elapsed.toFixed(1)}ms`);
});
