import test from 'node:test';
import assert from 'node:assert/strict';
import { tileId } from '../mockjs/tiles.mjs';
import { buildSichuanWall, sichuanKind, analyzeSichuanHand, sichuanWaitKinds, legalSichuanDiscards } from '../mockjs/sichuan_hand.mjs';

function holding(handKinds, meldKinds = []) {
  const copies = new Map();
  function physical(kinds) {
    return kinds.map((kind) => {
      const copy = (copies.get(kind) || 0) + 1;
      assert.ok(copy <= 4, `fixture不能有第五张${kind}`);
      copies.set(kind, copy);
      return tileId(Math.floor(kind / 10), kind % 10, copy);
    });
  }
  return { hand: physical(handKinds), melds: meldKinds.map(([type, kinds]) => ({ type, tiles: physical(kinds) })) };
}
const standard = [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29, 29];

// 当前只验证牌形基础，不代表匹配、计分和原UI已接通。
test('普通四川牌山使用108张唯一实体牌且不含字牌赖子', () => {
  const wall = buildSichuanWall();
  assert.equal(wall.length, 108);
  assert.equal(new Set(wall).size, 108);
  const counts = Array(27).fill(0);
  for (const id of wall) counts[sichuanKind(id)] += 1;
  assert.deepEqual(counts, Array(27).fill(4));
  assert.notEqual(wall, buildSichuanWall());
  for (const id of [0, 110, 115, 191.5, 201, 411, 450, 471, NaN, Infinity, '111']) {
    assert.throws(() => sichuanKind(id), RangeError);
  }
});

test('普通四川识别四面子一将并拒绝跨花色拼顺子', () => {
  const { hand } = holding(standard);
  const shapes = analyzeSichuanHand(hand, { missingSuit: 3 });
  assert.equal(shapes.length, 1);
  assert.equal(shapes[0].type, 'standard');
  assert.equal(shapes[0].pair, 17);
  assert.equal(shapes[0].groups.length, 4);
  assert.ok(shapes[0].groups.every((group) => group.type === 'sequence'));
  const bad = holding([18, 19, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 29, 29]);
  assert.deepEqual(analyzeSichuanHand(bad.hand, { missingSuit: 3 }), []);
  assert.deepEqual(analyzeSichuanHand(hand.slice(1), { missingSuit: 3 }), []);
});

test('七对允许一至三组四张牌，不能套用日麻七对子算法', () => {
  const fixtures = [
    [11, 11, 14, 14, 17, 17, 21, 21, 23, 23, 25, 25, 29, 29],
    [11, 11, 11, 11, 14, 14, 17, 17, 22, 22, 25, 25, 28, 28],
    [11, 11, 11, 11, 14, 14, 14, 14, 22, 22, 25, 25, 28, 28],
    [11, 11, 11, 11, 14, 14, 14, 14, 22, 22, 22, 22, 28, 28],
  ];
  for (const [quads, fixture] of fixtures.entries()) {
    const { hand } = holding(fixture);
    const shape = analyzeSichuanHand(hand, { missingSuit: 3 }).find((entry) => entry.type === 'sevenPairs');
    assert.equal(shape.pairs.length, 7);
    assert.equal(shape.quadKinds.length, quads);
  }
});

test('同一手牌保留七对和普通牌形以及不同面子分解供计分择优', () => {
  const dual = holding([11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 19, 19]);
  const shapes = analyzeSichuanHand(dual.hand, { missingSuit: 3 });
  assert.ok(shapes.some((entry) => entry.type === 'sevenPairs'));
  assert.ok(shapes.some((entry) => entry.type === 'standard'));
  const ambiguous = holding([11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15]);
  const patterns = analyzeSichuanHand(ambiguous.hand, { missingSuit: 3 });
  assert.ok(patterns.some((entry) => entry.groups.every((group) => group.type === 'triplet')));
  assert.ok(patterns.some((entry) => entry.groups.some((group) => group.type === 'sequence')));
});

test('定缺牌未清不能胡，且有缺牌时合法弃牌仅含缺牌实体', () => {
  const { hand } = holding(standard);
  assert.deepEqual(analyzeSichuanHand(hand, { missingSuit: 1 }), []);
  assert.deepEqual(sichuanWaitKinds(hand.slice(1), { missingSuit: 1 }), []);
  assert.deepEqual(legalSichuanDiscards(hand, 1), hand.filter((id) => id < 200));
  assert.deepEqual(legalSichuanDiscards(hand, 3), hand);
  assert.notEqual(legalSichuanDiscards(hand, 3), hand);
  assert.throws(() => analyzeSichuanHand(hand), /定缺/);
  assert.throws(() => legalSichuanDiscards(hand, 0), /定缺/);
});

test('碰杠只占一个面子，四杠仍可单钓，缺牌副露同样不能胡', () => {
  const fixture = holding([29, 29], [
    ['kan', [11, 11, 11, 11]], ['ankan', [14, 14, 14, 14]],
    ['kan', [21, 21, 21, 21]], ['ankan', [24, 24, 24, 24]],
  ]);
  const { hand, melds } = fixture;
  const shapes = analyzeSichuanHand(hand, { melds, missingSuit: 3 });
  assert.equal(shapes.length, 1);
  assert.deepEqual(shapes[0].groups.map((entry) => entry.type), Array(4).fill('quad'));
  assert.deepEqual(shapes[0].groups.map((entry) => entry.open), [true, false, true, false]);
  assert.deepEqual(analyzeSichuanHand(hand, { melds, missingSuit: 1 }), []);
  assert.deepEqual(sichuanWaitKinds(hand.slice(0, 1), { melds, missingSuit: 3 }), [17]);
});

test('非法碰杠、吃牌、稀疏副露以及重复实体均拒绝', () => {
  const { hand } = holding(standard);
  assert.throws(() => analyzeSichuanHand([hand[0], ...hand.slice(0, -1)], { missingSuit: 3 }), /重复实体/);
  for (const meld of [
    { type: 'chi', tiles: [111, 121, 131] },
    { type: 'pon', tiles: [111, 112] },
    { type: 'kan', tiles: [111, 112, 113] },
    { type: 'pon', tiles: [111, 112, 121] },
    { type: 'pon', tiles: Array(3) },
    { type: 'kan', tiles: [111, 112, 113, 115] },
  ]) {
    assert.throws(() => analyzeSichuanHand([], { melds: [meld], missingSuit: 3 }), RangeError);
  }
  assert.throws(() => analyzeSichuanHand([111, 112], {
    melds: [{ type: 'pon', tiles: [111, 113, 114] }], missingSuit: 3,
  }), /重复实体/);
});

test('听牌排除暗手加碰牌已占满四张的第五张', () => {
  const { hand, melds } = holding([11, 12, 13, 14, 21, 22, 23, 24, 25, 26], [['pon', [11, 11, 11]]]);
  const waits = sichuanWaitKinds(hand, { melds, missingSuit: 3 });
  assert.ok(!waits.includes(0));
  assert.ok(waits.includes(3));
});

test('判型和听牌不修改调用者的暗手与副露', () => {
  const { hand, melds } = holding([12, 13, 14, 21, 22, 23, 24, 25, 26, 29], [['pon', [11, 11, 11]]]);
  const snapshot = structuredClone({ hand, melds });
  Object.freeze(hand);
  for (const meld of melds) { Object.freeze(meld.tiles); Object.freeze(meld); }
  Object.freeze(melds);
  assert.deepEqual(sichuanWaitKinds(hand, { melds, missingSuit: 3 }), [17]);
  assert.ok(analyzeSichuanHand([...hand, tileId(2, 9, 2)], { melds, missingSuit: 3 }).length);
  assert.deepEqual({ hand, melds }, snapshot);
});
