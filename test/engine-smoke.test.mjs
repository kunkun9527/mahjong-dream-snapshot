import test from 'node:test';
import assert from 'node:assert/strict';

import { GameEngine } from '../mockjs/engine.mjs';
import { calcWin, furoGroupStr } from '../mockjs/ai.mjs';
import { buildWall, decodeId, tileId } from '../mockjs/tiles.mjs';

async function playMatch(players, seed, matchLength = 'east') {
  let result;
  const engine = new GameEngine({
    players,
    startScore: players === 3 ? 35_000 : 25_000,
    matchLength,
    seed,
    speed: 0,
    autoHuman: true,
    maxHands: matchLength === 'hanchan' ? 64 : 32,
    log: () => {},
    onFinish: (scores) => {
      result = scores.slice();
    },
  });
  await engine.start();
  return {
    scores: result,
    riichiSticks: engine.riichiSticks,
    handIndex: engine.handIndex,
  };
}

test('固定种子对局可复现且点棒守恒', async () => {
  for (const [players, seed, initialTotal] of [[4, 7, 100_000], [3, 7, 105_000]]) {
    const first = await playMatch(players, seed);
    const second = await playMatch(players, seed);
    assert.deepEqual(second, first);
    assert.equal(first.scores.length, players);
    assert.equal(first.scores.reduce((sum, score) => sum + score, 0) + first.riichiSticks * 1_000, initialTotal);
  }
});

test('四种正式模式都能固定种子打到终局且点棒守恒', async () => {
  const modes = [
    [4, 'east', 100_000],
    [4, 'hanchan', 100_000],
    [3, 'east', 105_000],
    [3, 'hanchan', 105_000],
  ];
  for (const [players, matchLength, initialTotal] of modes) {
    const result = await playMatch(players, 19, matchLength);
    assert.equal(result.scores.length, players);
    assert.equal(result.scores.reduce((sum, score) => sum + score, 0) + result.riichiSticks * 1_000, initialTotal);
    assert.ok(result.handIndex > 0);
  }
});

test('三麻牌山移除二万至八万但保留北风', () => {
  const { tiles } = buildWall({ sanma: true, akaCount: 1 });
  const decoded = tiles.map(decodeId);
  assert.equal(decoded.some(({ suit, rank }) => suit === 1 && rank >= 2 && rank <= 8), false);
  assert.equal(decoded.filter(({ suit, rank }) => suit === 4 && rank === 4).length, 4);
});

test('三麻受入只排除二万至八万', () => {
  const engine = new GameEngine({ players: 3 });
  engine.players = [];
  engine.doraIndicators = [];
  const remain = engine.remainOfFor({ hand: [] });
  assert.equal(remain(1), 0);
  assert.equal(remain(7), 0);
  assert.equal(remain(30), 4);
});

test('暗杠按门清格式交给计分库', () => {
  const ankan = {
    type: 'ankan',
    tiles: [1, 2, 3, 4].map((copy) => tileId(1, 1, copy)),
  };
  assert.equal(furoGroupStr(ankan, new Set()), '11m');

  const concealed = [
    [1, 2], [1, 3], [1, 4],
    [2, 2], [2, 3], [2, 4],
    [3, 2], [3, 3], [3, 4],
    [4, 5], [4, 5],
  ].map(([suit, rank], index) => tileId(suit, rank, index % 4 + 1));
  const result = calcWin(concealed, [ankan], new Set(), { roundWind: 1, seatWind: 2 });
  assert.equal(result.isAgari, true);
  assert.equal(result.hasYaku, true);
});

test('计分库接收双立直与天地和上下文', () => {
  const hand = [
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 3],
    [3, 4], [3, 5], [3, 6],
    [4, 7], [4, 7],
  ].map(([suit, rank], index) => tileId(suit, rank, index % 4 + 1));
  const doubleRiichi = calcWin(hand, [], new Set(), { doubleRiichi: true, roundWind: 1, seatWind: 2 });
  assert.equal(Object.hasOwn(doubleRiichi.yaku, 'ダブル立直'), true);
  const tenho = calcWin(hand, [], new Set(), { tenho: true, roundWind: 1, seatWind: 1 });
  assert.equal(Object.hasOwn(tenho.yaku, '天和'), true);
});
