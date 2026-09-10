import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../mockjs/engine.mjs';
import { PlayAction } from '../mockjs/proto_enum.mjs';

function makePlayer(hand, melds = []) {
  return { seat: 1, hand, melds };
}

function evaluate(player, card, kind = 'pon', used = []) {
  const engine = new GameEngine({ players: 3 });
  const before = structuredClone(player);
  const result = engine.hasOpenYakuRoute(player, card, kind, used);
  assert.deepEqual(player, before, '评估不能修改实体牌或副露');
  return result;
}

test('拔北不应把全中张的开门路线误判为含幺九牌', () => {
  const hand = [221, 222, 231, 241, 251, 261, 271, 281, 321, 331, 341, 361, 371];
  assert.equal(evaluate(makePlayer(hand), 223), true);
  assert.equal(evaluate(makePlayer(hand, [{ type: 'babei', tiles: [441] }]), 223), true);
});

test('拔北次数不能充当对对和的已完成面子数', () => {
  const hand = [211, 212, 231, 241, 261, 281, 291, 311, 331, 351, 371, 391, 411];
  const norths = [441, 442, 443].map((tile) => ({ type: 'babei', tiles: [tile] }));
  assert.equal(evaluate(makePlayer(hand), 213), false);
  assert.equal(evaluate(makePlayer(hand, norths), 213), false);
});

test('拟碰的对子不能同时计入剩余暗手和已完成面子', () => {
  const hand = [111, 112, 221, 222, 331, 332, 191, 241, 261, 381, 411, 421, 431];
  assert.equal(evaluate(makePlayer(hand), 113), false);
});

test('真实役牌与足够的剩余对子仍能提供开门路线', () => {
  const hand = [111, 112, 221, 222, 331, 332, 411, 412, 191, 241, 261, 381, 431];
  assert.equal(evaluate(makePlayer(hand), 113), true);
  assert.equal(evaluate(makePlayer([451, 452, 111, 191, 211, 221, 231, 311, 321, 331, 411, 421, 431]), 453), true);
});

test('三次拔北不能诱使 AI 为无役的表面听牌而碰幺九牌', () => {
  const engine = new GameEngine({ players: 3, speed: 0 });
  engine.players = [0, 1, 2].map((seat) => ({
    seat, isHuman: false, score: 35_000, hand: [], melds: [],
    discards: [], discardKinds: new Set(), riichi: false, menzen: true,
  }));
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.remain = 30;
  const p = engine.players[1];
  p.hand = [211, 212, 231, 241, 251, 311, 321, 331, 351, 352, 381, 391, 411];
  p.melds = [441, 442, 443].map((tile) => ({ type: 'babei', tiles: [tile] }));
  assert.equal(engine.currentShanten(p), 1);
  assert.equal(engine.shantenAfterClaim(p, 213, 'pon'), 0);
  assert.equal(engine.aiClaim(1, 0, 213, [PlayAction.Peng, PlayAction.Guo]), null);
});
