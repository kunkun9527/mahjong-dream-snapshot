import test from 'node:test';
import assert from 'node:assert/strict';
import { tileId } from '../mockjs/tiles.mjs';
import { buildSichuanWall, legalSichuanDiscards, sichuanKind, sichuanWaitKinds, analyzeSichuanHand } from '../mockjs/sichuan_hand.mjs';
import { chooseSichuanMissingSuit, chooseSichuanExchange, chooseSichuanDiscard, chooseSichuanClaim, sichuanShanten } from '../mockjs/sichuan_ai.mjs';

function holding(kinds, groups = []) {
  const copies = new Map();
  const tiles = (list) => list.map((kind) => {
    const copy = (copies.get(kind) || 0) + 1;
    assert.ok(copy <= 4);
    copies.set(kind, copy);
    return tileId(Math.floor(kind / 10), kind % 10, copy);
  });
  return { hand: tiles(kinds), melds: groups.map(([type, list]) => ({ type, tiles: tiles(list) })), missingSuit: 3 };
}
const forced = [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29, 31];
const readyKong = [11, 11, 11, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29];

test('四川AI七对向听允许四张当两对，缺牌不能凑入标准胡或国士', () => {
  const ready = holding([11, 11, 11, 11, 14, 14, 14, 14, 22, 22, 22, 22, 28]);
  assert.equal(sichuanShanten(ready.hand, ready), 0);
  assert.equal(sichuanShanten([...ready.hand, 282], ready), -1);
  const deficient = holding([11, 11, 11, 11, 14, 14, 14, 14, 22, 22, 22, 22, 31]);
  assert.equal(sichuanShanten(deficient.hand, deficient), 1);
  const onlyMissing = buildSichuanWall().filter((id) => id >= 300).slice(0, 13);
  assert.equal(sichuanShanten(onlyMissing, { missingSuit: 3 }), 13);
});

test('换三张始终从本人选择三个不同实体且同门，定缺优先最少门', () => {
  const fixture = holding([11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 31, 32, 33]);
  const selected = chooseSichuanExchange(fixture.hand);
  assert.deepEqual(selected, [311, 321, 331]);
  assert.equal(chooseSichuanMissingSuit(fixture.hand), 3);
  assert.equal(chooseSichuanMissingSuit(holding(readyKong).hand), 3);
  assert.deepEqual(chooseSichuanExchange(fixture.hand.slice().reverse()), selected);
  for (const invalid of [[], fixture.hand.slice(1), Array(13)]) {
    assert.throws(() => chooseSichuanExchange(invalid), RangeError);
    assert.throws(() => chooseSichuanMissingSuit(invalid), RangeError);
  }
});

test('有缺必打缺，受入仅统计尚未公开的真实剩余牌', () => {
  const view = holding(forced);
  const choice = chooseSichuanDiscard(view);
  assert.equal(choice.tile, 311);
  assert.equal(choice.shanten, 0);
  assert.deepEqual(choice.waits, [17]);
  assert.equal(choice.ukeire, 3);
  assert.equal(chooseSichuanDiscard({ ...view, visibleTiles: [292, 293] }).ukeire, 1);
  const deadWait = chooseSichuanDiscard({ ...view, visibleTiles: [292, 293, 294] });
  assert.equal(deadWait.shanten, 0); // 别家已打光的牌仍可形式听牌，受入必须为0。
  assert.equal(deadWait.ukeire, 0);
  assert.deepEqual(deadWait.waits, []);
});

test('本人碰三张又持第四张不能误认为听第五张，弃牌应改听实际可存在的牌', () => {
  const melds = [['pon', [11, 11, 11]], ['kan', [14, 14, 14, 14]], ['kan', [21, 21, 21, 21]], ['kan', [24, 24, 24, 24]]];
  const impossible = holding([11], melds);
  assert.equal(sichuanShanten(impossible.hand, impossible), 1);
  const bothDead = holding([11, 14], [['pon', [11, 11, 11]], ['pon', [14, 14, 14]],
    ['pon', [21, 21, 21]], ['pon', [24, 24, 24]]]);
  assert.equal(sichuanShanten(bothDead.hand, bothDead), 1);
  const view = holding([11, 18], melds);
  const choice = chooseSichuanDiscard(view);
  assert.equal(choice.tile, 111);
  assert.equal(choice.shanten, 0);
  assert.deepEqual(choice.waits, [7]);
  assert.equal(choice.ukeire, 3);
});

test('响应优先权威允许的胡牌，禁止因自行识别牌形越过过胡等局序限制', () => {
  const view = holding(forced.slice(0, -1));
  assert.deepEqual(chooseSichuanClaim(view, { tile: 292, canHu: true }), { type: 'hu', tiles: [] });
  assert.deepEqual(chooseSichuanClaim(view, { tile: 292 }), { type: 'pass', tiles: [] });
  const tripleDragon = holding([11, 11, 11, 11, 14, 14, 14, 14, 22, 22, 22, 28, 28]);
  assert.equal(chooseSichuanClaim(tripleDragon, { tile: 224, canHu: true, canKong: true }).type, 'hu');
});

test('明杠提交三张本人实体，碰仅在改善向听时接受且不返回吃牌', () => {
  const kong = chooseSichuanClaim(holding(readyKong), { tile: 114, canKong: true, canPon: true });
  assert.deepEqual(kong, { type: 'kan', tiles: [111, 112, 113] });
  const improve = holding([11, 11, 14, 15, 16, 21, 22, 23, 24, 26, 29, 29, 18]);
  assert.equal(sichuanShanten(improve.hand, improve), 1);
  const pon = chooseSichuanClaim(improve, { tile: 113, canPon: true });
  assert.deepEqual(pon, { type: 'pon', tiles: [111, 112] });
  const unchanged = chooseSichuanClaim(holding(readyKong), { tile: 114, canPon: true });
  assert.equal(unchanged.type, 'pass');
});

test('坏的权威选项或公开牌重复必须报错，不能拼凑实体牌或静默偷看牌山', () => {
  const view = holding(readyKong);
  for (const request of [{ tile: 114, canHu: true }, { tile: 291, canPon: true },
    { tile: 292, canKong: true }, { tile: 114, canKong: 1 }, { tile: 111 }, { tile: 451 }]) {
    assert.throws(() => chooseSichuanClaim(view, request), RangeError);
  }
  const missing = holding([31, 31, 11, 12, 13, 14, 15, 16, 21, 22, 23, 29, 29]);
  assert.throws(() => chooseSichuanClaim(missing, { tile: 313, canPon: true }), /定缺/);
  assert.throws(() => chooseSichuanDiscard({ ...holding(forced), visibleTiles: [111] }), /重复实体/);
  assert.throws(() => chooseSichuanDiscard({ ...holding(forced), visibleTiles: [292, 292] }), /重复实体/);
  assert.throws(() => chooseSichuanDiscard({ ...holding(forced), visibleTiles: Array(2) }), RangeError);
  assert.throws(() => chooseSichuanDiscard(view), /可出牌/);
});

test('AI不会读取对手暗手未来牌山等隐藏字段，决策及其返回值不修改冻结输入', () => {
  const view = holding(forced);
  for (const key of ['wall', 'opponents', 'players', 'replacements', 'opponentHands', 'futureTiles']) {
    Object.defineProperty(view, key, { enumerable: true, get() { assert.fail(`读取了隐藏字段${key}`); } });
  }
  Object.freeze(view.hand);
  Object.freeze(view.melds);
  Object.freeze(view);
  const decision = chooseSichuanDiscard(view);
  assert.equal(decision.tile, 311);
  decision.waits.push(0);
  assert.deepEqual(chooseSichuanDiscard(view).waits, [17]);
  chooseSichuanExchange(view.hand);
  chooseSichuanMissingSuit(view.hand);
  const claimView = holding(readyKong);
  Object.defineProperty(claimView, 'wall', { enumerable: true, get() { assert.fail('读取了未来牌山'); } });
  assert.equal(chooseSichuanClaim(claimView, { tile: 114, canKong: true }).type, 'kan');
});

test('固定种子百手随机牌逐项检验换牌定缺弃牌合法、手序稳定和零向听真实等待', () => {
  let state = 20260912;
  function random(n) { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % n; }
  for (let sample = 0; sample < 100; sample += 1) {
    const wall = buildSichuanWall();
    for (let i = wall.length - 1; i > 0; i -= 1) { const j = random(i + 1); [wall[i], wall[j]] = [wall[j], wall[i]]; }
    const hand = wall.slice(0, 14);
    const exchange = chooseSichuanExchange(hand);
    assert.equal(exchange.length, 3);
    assert.equal(new Set(exchange).size, 3);
    assert.ok(exchange.every((tile) => hand.includes(tile)));
    assert.equal(new Set(exchange.map((tile) => Math.floor(sichuanKind(tile) / 9))).size, 1);
    const missingSuit = chooseSichuanMissingSuit(hand);
    const view = { hand, missingSuit, visibleTiles: wall.slice(14, 25) };
    const choice = chooseSichuanDiscard(view);
    assert.ok(legalSichuanDiscards(hand, missingSuit).includes(choice.tile));
    assert.deepEqual(chooseSichuanDiscard({ ...view, hand: hand.slice().reverse() }), choice);
    const rest = hand.filter((tile) => tile !== choice.tile);
    assert.equal(choice.shanten, sichuanShanten(rest, { missingSuit }));
    if (choice.shanten === 0) assert.ok(sichuanWaitKinds(rest, { missingSuit }).length > 0);
    const actual = analyzeSichuanHand(hand, { missingSuit }).length > 0;
    assert.equal(sichuanShanten(hand, { missingSuit }) === -1, actual);
  }
});
