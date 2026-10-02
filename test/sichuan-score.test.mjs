import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeId, tileId } from '../mockjs/tiles.mjs';
import { scoreSichuanHand, maxSichuanReadyScore, sichuanWinPayments, sichuanKongPayments } from '../mockjs/sichuan_score.mjs';
import { SICHUAN_CATALOG } from '../mockjs/sichuan_catalog.mjs';

function holding(handKinds, groups = []) {
  const copies = new Map();
  function tiles(kinds) {
    return kinds.map((kind) => {
      const copy = (copies.get(kind) || 0) + 1;
      assert.ok(copy <= 4, `fixture不能有第五张${kind}`);
      copies.set(kind, copy);
      return tileId(Math.floor(kind / 10), kind % 10, copy);
    });
  }
  return { hand: tiles(handKinds), melds: groups.map(([type, kinds]) => ({ type, tiles: tiles(kinds) })) };
}
const repeat = (kind, count) => Array(count).fill(kind);
const groups = (kinds, type = 'pon') => kinds.map((kind) => [type, repeat(kind, type === 'pon' ? 3 : 4)]);
const standard = [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29, 29];
const options = { missingSuit: 3, topBei: 256 };
const names = (score) => score.yaku.map((entry) => entry.name).sort();
function score(fixture, extra = {}) {
  return scoreSichuanHand(fixture.hand, { ...options, melds: fixture.melds, ...extra });
}

const fixtures = [
  ['平胡', 1, holding(standard)],
  ['断幺九', 2, holding([12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27, 28, 28])],
  ['碰碰胡', 2, holding([11, 11, 11, 14, 14, 14, 21, 21, 21, 24, 24, 24, 29, 29])],
  ['清一色', 4, holding([11, 12, 13, 14, 15, 16, 17, 17, 17, 18, 18, 18, 19, 19])],
  ['七对', 4, holding([11, 11, 14, 14, 17, 17, 21, 21, 23, 23, 25, 25, 29, 29])],
  ['金钩钓', 4, holding([29, 29], groups([11, 14, 21, 24]))],
  ['幺九', 4, holding([11, 12, 13, 19, 19, 19, 21, 22, 23, 27, 28, 29, 29, 29])],
  ['清碰', 8, holding([11, 11, 11, 14, 14, 14, 17, 17, 17, 18, 18, 18, 19, 19])],
  ['龙七对', 8, holding([16, 16, 16, 16, 17, 17, 19, 19, 23, 23, 25, 25, 28, 28])],
  ['将对', 8, holding([12, 12, 12, 15, 15, 15, 18, 18, 18, 22, 22, 22, 25, 25])],
  ['清七对', 16, holding([11, 11, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 19, 19])],
  ['清金钩钓', 16, holding([19, 19], groups([11, 14, 17, 18]))],
  ['将七对', 16, holding([12, 12, 15, 15, 18, 18, 22, 22, 25, 25, 28, 28, 28, 28])],
  ['双龙七对', 16, holding([16, 16, 16, 16, 21, 21, 21, 21, 23, 23, 26, 26, 29, 29])],
  ['清龙七对', 32, holding([12, 12, 12, 12, 13, 13, 15, 15, 17, 17, 18, 18, 19, 19])],
  ['三龙七对', 32, holding([16, 16, 16, 16, 21, 21, 21, 21, 26, 26, 26, 26, 29, 29])],
  ['将双龙七对', 64, holding([12, 12, 12, 12, 15, 15, 15, 15, 22, 22, 25, 25, 28, 28])],
  ['十八罗汉', 64, holding([28, 28], groups([11, 16, 21, 27], 'kan'))],
  ['将三龙七对', 126, holding([12, 12, 12, 12, 15, 15, 15, 15, 22, 22, 22, 22, 28, 28])],
  ['清十八罗汉', 256, holding([18, 18], groups([11, 12, 16, 17], 'ankan'))],
];
const root = holding([11, 11, 11, 11, 12, 13, 21, 22, 23, 24, 25, 26, 29, 29]);
const kong = holding([11, 12, 13, 21, 22, 23, 24, 25, 26, 29, 29], groups([14], 'ankan'));

test('原规则页27种可见番型逐项由实体牌和明确情境命中且复合番不重复计分', () => {
  const found = new Set();
  for (const gameType of [5021, 5022]) {
    for (const [name, expected, fixture] of fixtures) {
      const result = score(fixture, { gameType, topBei: gameType === 5021 ? 10240 : 256 });
      assert.equal(result.rawBei, expected, `${gameType} ${name}`);
      assert.deepEqual(names(result), [name]);
      for (const item of result.yaku) {
        assert.equal(Math.floor(item.yiType / 100000), gameType);
        found.add(item.name);
      }
    }
  }
  const contexts = [
    [root, {}, '根', 2],
    [holding(standard), { winType: 'tsumo' }, '自摸', 2],
    [kong, { winType: 'tsumo', afterKong: true }, '杠上开花', 8],
    [holding(standard), { winType: 'robKong' }, '抢杠胡', 2],
    [holding(standard), { winType: 'tsumo', lastTile: true }, '海底捞月', 4],
    [holding(standard), { winType: 'tsumo', opening: 'heaven' }, '天胡', 32],
    [holding(standard), { winType: 'tsumo', opening: 'earth' }, '地胡', 32],
  ];
  for (const [fixture, context, name, expected] of contexts) {
    const result = score(fixture, context);
    assert.equal(result.rawBei, expected, name);
    assert.ok(names(result).includes(name));
    found.add(name);
  }
  assert.deepEqual([...found].sort(), SICHUAN_CATALOG.games[5022].yaku.filter((entry) => entry.ruleOpen).map((entry) => entry.name).sort());
});

test('根计入暗手四归一和实际杠，但龙七对与十八罗汉已经包含的根不能再翻倍', () => {
  assert.equal(score(root).countedRoots, 1);
  assert.equal(score(kong).countedRoots, 1);
  for (const [name, , fixture] of fixtures.filter(([name]) => /龙七对|将七对|十八罗汉/.test(name))) {
    const result = score(fixture);
    assert.ok(result.rootCount >= 1, name);
    assert.equal(result.countedRoots, 0, name);
  }
  const two = holding([21, 22, 23, 24, 25, 26, 29, 29], groups([11, 14], 'kan'));
  const three = holding([24, 25, 26, 29, 29], groups([11, 14, 21], 'ankan'));
  assert.deepEqual(names(score(two)), ['2根', '平胡']);
  assert.equal(score(two).rawBei, 4);
  assert.equal(score(three).rawBei, 8);
});

test('没有专用名称的清双龙清三龙仍以清一色乘龙级别，不混入清七对或多收根', () => {
  const two = holding([11, 11, 11, 11, 14, 14, 14, 14, 15, 15, 17, 17, 19, 19]);
  const three = holding([11, 11, 11, 11, 14, 14, 14, 14, 17, 17, 17, 17, 19, 19]);
  assert.equal(score(two).rawBei, 64);
  assert.deepEqual(names(score(two)), ['双龙七对', '清一色'].sort());
  assert.equal(score(three).rawBei, 128);
  assert.deepEqual(names(score(three)), ['三龙七对', '清一色'].sort());
});

test('幺九按具体面子分解判断，副露同样参与清一色和断幺九判断', () => {
  const terminalRuns = holding([11, 12, 13, 11, 12, 13, 17, 18, 19, 19, 19, 19, 11, 11]);
  assert.equal(score(terminalRuns).rawBei, 64); // 清一色4 × 幺九4 × 两根4
  assert.deepEqual(names(score(terminalRuns)), ['2根', '清一色', '幺九'].sort());
  const exposedTerminal = holding([12, 13, 14, 15, 16, 17, 16, 17, 18, 18, 18], groups([21]));
  assert.deepEqual(names(score(exposedTerminal)), ['平胡']);
});

test('多种分解必须选最大未封顶倍率，七对和普通胡不能只取首个分解', () => {
  const pairs = holding([11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 19, 19]);
  assert.equal(score(pairs).shape.type, 'sevenPairs');
  assert.equal(score(pairs).rawBei, 16);
  const triplets = holding([11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15]);
  assert.equal(score(triplets).rawBei, 8);
  assert.ok(score(triplets).shape.groups.every((group) => group.type === 'triplet'));
});

test('将对与金钩钓按原未互斥的完整番相乘，但不额外计碰碰胡和断幺九', () => {
  const jiangHook = holding([25, 25], groups([12, 15, 18, 22]));
  assert.equal(score(jiangHook).rawBei, 32);
  assert.deepEqual(names(score(jiangHook)), ['将对', '金钩钓'].sort());
  const jiangKongs = holding([25, 25], groups([12, 15, 18, 22], 'kan'));
  assert.equal(score(jiangKongs).rawBei, 512);
  assert.deepEqual(names(score(jiangKongs)), ['将对', '十八罗汉'].sort());
});

test('自摸抢杠海底天地区分情境，四川最后补牌可同时满足杠上花和海底', () => {
  const result = score(kong, { winType: 'tsumo', afterKong: true, lastTile: true });
  assert.equal(result.rawBei, 16);
  for (const context of [
    { winType: 'ron', afterKong: true }, { winType: 'robKong', lastTile: true },
    { opening: 'heaven' }, { winType: 'tsumo', opening: 'earth', afterKong: true },
    { winType: 'tsumo', opening: 'heaven', lastTile: true }, { winType: 'discard' },
    { winType: 'tsumo', afterKong: 1 }, { opening: 'invalid' },
  ]) assert.throws(() => score(kong, context), RangeError);
  assert.throws(() => score(kong, { winType: 'tsumo', opening: 'heaven' }), /副露/);
  assert.throws(() => score(holding(standard), { winType: 'tsumo', afterKong: true }), /实际杠/);
  assert.ok(!names(score(holding(standard), { winType: 'tsumo', opening: 'heaven' })).includes('自摸'));
});

test('最终乘积统一封顶，原将三龙七对126保持原值而不改成128', () => {
  const fixture = fixtures.find(([name]) => name === '将三龙七对')[2];
  const capped = score(fixture, { winType: 'tsumo', topBei: 128 });
  assert.equal(capped.rawBei, 252);
  assert.equal(capped.bei, 128);
  assert.equal(capped.capped, true);
  assert.equal(score(fixture, { winType: 'tsumo' }).bei, 252);
  const clearKongs = fixtures.find(([name]) => name === '清十八罗汉')[2];
  assert.equal(score(clearKongs, { topBei: 128 }).bei, 128);
  assert.equal(score(clearKongs).capped, false);
  for (const context of [{ topBei: undefined }, { topBei: 100 }, { gameType: 5023 }, { gameType: 5021, topBei: 256 }]) {
    assert.throws(() => score(fixture, context), RangeError);
  }
});

test('查大叫选择最大合法待牌，不加自摸抢杠天胡倍率也不等待自己的第五张', () => {
  // 听2万与3万：2万形成龙七对8倍，3万只有平胡1倍。
  const hand = holding([12, 12, 12, 13, 13, 14, 14, 21, 21, 22, 22, 23, 23]).hand;
  const result = maxSichuanReadyScore(hand, { ...options, winType: 'tsumo', opening: 'heaven', afterKong: true });
  assert.equal(result.waitKind, 1);
  assert.equal(result.bei, 8);
  assert.deepEqual(names(result), ['龙七对']);
  assert.equal(result.winType, 'ron');
  const impossible = holding([11, 11, 11, 11, 12, 13, 21, 22, 23, 24, 25, 26, 29]);
  assert.equal(maxSichuanReadyScore(impossible.hand, { ...options, missingSuit: 1 }), null);
  const fifth = holding([11], [...groups([11]), ...groups([14, 21, 24], 'kan')]);
  assert.equal(maxSichuanReadyScore(fifth.hand, { ...options, melds: fifth.melds }), null);
});

test('未胡或仍有缺牌返回空结果，非法重复实体、字牌赖子与错误定缺直接拒绝', () => {
  const fixture = holding(standard);
  assert.equal(scoreSichuanHand(fixture.hand.slice(1), options), null);
  assert.equal(score(fixture, { missingSuit: 1 }), null);
  assert.throws(() => score({ hand: [fixture.hand[0], ...fixture.hand.slice(0, -1)], melds: [] }), /重复实体/);
  assert.throws(() => score({ hand: [451, ...fixture.hand.slice(1)], melds: [] }), /无效/);
  assert.throws(() => score(fixture, { missingSuit: 0 }), /定缺/);
});

test('和牌自摸仅向在局对手收款，荣和仅由点炮者承担且总分守恒', () => {
  const input = { winner: 2, activeSeats: [0, 2, 3], bei: 8, baseScore: 10 };
  assert.deepEqual(sichuanWinPayments(input).delta, [-80, 0, 160, -80]);
  assert.deepEqual(sichuanWinPayments({ ...input, loser: 3 }).delta, [0, 0, 80, -80]);
  for (const activeSeats of [[0, 2], [0, 2, 3], [0, 1, 2, 3]]) {
    const result = sichuanWinPayments({ ...input, activeSeats });
    assert.equal(result.delta.reduce((a, b) => a + b, 0), 0);
    assert.equal(result.transfers.length, activeSeats.length - 1);
  }
});

test('明杠只收放杠者两底，补杠每家一底，暗杠每家两底，先碰后补免收', () => {
  const input = { seat: 1, activeSeats: [0, 1, 3], baseScore: 10 };
  assert.deepEqual(sichuanKongPayments({ ...input, kind: 'exposed', from: 3 }).delta, [0, 20, 0, -20]);
  assert.deepEqual(sichuanKongPayments({ ...input, kind: 'added' }).delta, [-10, 20, 0, -10]);
  assert.deepEqual(sichuanKongPayments({ ...input, kind: 'concealed' }).delta, [-20, 40, 0, -20]);
  assert.deepEqual(sichuanKongPayments({ ...input, kind: 'added', waived: true }), { delta: [0, 0, 0, 0], transfers: [] });
});

test('支付拒绝重复离局稀疏座位、负金额、非法免杠和安全整数溢出', () => {
  const input = { winner: 1, activeSeats: [0, 1, 2, 3], bei: 2, baseScore: 10 };
  for (const change of [{ activeSeats: [1, 1] }, { activeSeats: [0, 2] }, { activeSeats: [1] },
    { activeSeats: [1, , 2] }, { activeSeats: [1, 4] }, { winner: '1' }, { loser: 1 }, { loser: 4 },
    { bei: 0 }, { bei: -2 }, { bei: 1.5 }, { baseScore: 0 }, { baseScore: Number.MAX_SAFE_INTEGER },
    { bei: Number.MAX_SAFE_INTEGER, baseScore: 1 }]) assert.throws(() => sichuanWinPayments({ ...input, ...change }), RangeError);
  const kongInput = { seat: 1, activeSeats: [0, 1, 2, 3], baseScore: 10, kind: 'added' };
  for (const change of [{ kind: 'unknown' }, { kind: 'exposed' }, { kind: 'exposed', from: 1 },
    { from: 2 }, { kind: 'concealed', waived: true }, { waived: 1 }]) assert.throws(() => sichuanKongPayments({ ...kongInput, ...change }), RangeError);
});

test('番型计分不受花色置换、实体副本编号、手序和副露顺序影响', () => {
  for (const [, , fixture] of fixtures) {
    for (const permutation of [[0, 2, 3, 1], [0, 3, 1, 2]]) {
      const convert = (id) => {
        const { suit, rank, copy } = decodeId(id);
        return tileId(permutation[suit], rank, 5 - copy);
      };
      const transformed = { hand: fixture.hand.map(convert).reverse(),
        melds: fixture.melds.map((meld) => ({ ...meld, tiles: meld.tiles.map(convert).reverse() })).reverse() };
      const before = score(fixture);
      const after = score(transformed, { missingSuit: permutation[3] });
      assert.equal(after.rawBei, before.rawBei);
      assert.equal(after.bei, before.bei);
      assert.deepEqual(names(after), names(before));
      assert.equal(after.countedRoots, before.countedRoots);
    }
  }
});

test('计分与支付不修改冻结输入，也不能通过修改返回结果污染下一次计分', () => {
  const fixture = holding([29, 29], groups([11, 14, 21, 24], 'ankan'));
  for (const meld of fixture.melds) { Object.freeze(meld.tiles); Object.freeze(meld); }
  Object.freeze(fixture.melds);
  Object.freeze(fixture.hand);
  const result = score(fixture);
  result.yaku[0].bei = 999;
  result.shape.groups[0].kind = 999;
  assert.equal(score(fixture).bei, 64);
  const input = Object.freeze({ winner: 1, activeSeats: Object.freeze([0, 1, 2, 3]), bei: 4, baseScore: 10 });
  assert.deepEqual(sichuanWinPayments(input).delta, [-40, 120, -40, -40]);
});
