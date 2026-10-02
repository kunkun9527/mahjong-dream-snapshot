import test from 'node:test';
import assert from 'node:assert/strict';
import { tileId } from '../mockjs/tiles.mjs';
import { settleSichuanDraw } from '../mockjs/sichuan_settlement.mjs';

const rules = { topBei: 256, baseScore: 3 };
function fixture() {
  const copies = new Map();
  const player = (kinds, extra = {}) => ({
    hand: kinds.map((kind) => {
      const copy = (copies.get(kind) ?? 0) + 1;
      assert.ok(copy <= 4);
      copies.set(kind, copy);
      return tileId(Math.floor(kind / 10), kind % 10, copy);
    }), melds: [], missingSuit: 3, won: false, discardCount: 10, allDiscardsMissing: false, ...extra,
  });
  return [
    player([11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29]), // 平胡待29
    player([11, 12, 14, 16, 18, 19, 21, 23, 25, 27, 28, 29, 29]), // 未听
    player([11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 31]), // 花猪
    player([12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27, 28, 28], { won: true }),
  ];
}
const kong = (seat, from, amount, transferred = false) => ({ seat, transfers: [{ from, to: seat, amount }], transferred });

test('荒牌退税按原始付款人返还，查叫不收自摸番，花猪赔已胡与未胡非花猪', () => {
  const players = fixture();
  const kongs = [kong(1, 0, 6), kong(1, 3, 3), kong(2, 1, 3), kong(3, 1, 6), kong(0, 1, 6)];
  const before = structuredClone({ players, kongs });
  const result = settleSichuanDraw(players, kongs, rules);
  assert.deepEqual(result.status.map((entry) => entry.type), ['ready', 'notReady', 'flower', 'won']);
  assert.equal(result.status[0].bei, 1);
  assert.deepEqual(result.transfers.filter((entry) => entry.reason === 'refund').map(({ from, to, amount }) => ({ from, to, amount })),
    [{ from: 1, to: 0, amount: 6 }, { from: 1, to: 3, amount: 3 }, { from: 2, to: 1, amount: 3 }]);
  assert.deepEqual(result.transfers.filter((entry) => entry.reason === 'ready').map(({ from, to, amount }) => ({ from, to, amount })),
    [{ from: 1, to: 0, amount: 3 }]);
  assert.deepEqual(result.transfers.filter((entry) => entry.reason === 'flower').map(({ from, to, amount }) => ({ from, to, amount })),
    [0, 1, 3].map((to) => ({ from: 2, to, amount: 48 })));
  assert.equal(result.delta.reduce((sum, points) => sum + points, 0), 0);
  assert.deepEqual({ players, kongs }, before);
});

test('全程打缺花猪免赔且不叠查叫，但仍退税；零次出牌不能冒充全程打缺', () => {
  const players = fixture();
  players[2].allDiscardsMissing = true;
  const kongs = [kong(2, 0, 6)];
  let result = settleSichuanDraw(players, kongs, rules);
  assert.equal(result.status[2].exempt, true);
  assert.deepEqual(result.transfers.filter((entry) => entry.from === 2).map((entry) => entry.reason), ['refund']);
  players[2].discardCount = 0;
  result = settleSichuanDraw(players, kongs, rules);
  assert.equal(result.status[2].exempt, false);
  assert.equal(result.transfers.filter((entry) => entry.from === 2 && entry.reason === 'flower').length, 3);
});

test('已呼叫转移的杠分不重复退税，原收杠者未听也不能再返一次', () => {
  const players = fixture();
  const result = settleSichuanDraw(players, [kong(1, 0, 6, true)], rules);
  assert.ok(!result.transfers.some((entry) => entry.reason === 'refund'));
});

test('多名花猪互不赔付，只有未胡听牌者收查叫，已胡者保留杠分', () => {
  const players = fixture();
  players[1].missingSuit = 2;
  const result = settleSichuanDraw(players, [kong(3, 1, 6)], rules);
  assert.deepEqual(result.status.map((entry) => entry.type), ['ready', 'flower', 'flower', 'won']);
  assert.equal(result.transfers.length, 4);
  assert.ok(result.transfers.every((entry) => entry.reason === 'flower' && [0, 3].includes(entry.to)));
});

test('荒牌清算拒绝重复实体、错张数、伪造杠费与支付溢出且输入不变', () => {
  const players = fixture();
  const before = structuredClone(players);
  const duplicate = structuredClone(players);
  duplicate[1].hand[0] = duplicate[0].hand[0];
  assert.throws(() => settleSichuanDraw(duplicate, [], rules), /重复实体/);
  const short = structuredClone(players);
  short[1].hand.pop();
  assert.throws(() => settleSichuanDraw(short, [], rules), /张数/);
  assert.throws(() => settleSichuanDraw(players, [kong(1, 1, 6)], rules), /杠费/);
  assert.throws(() => settleSichuanDraw(players, [kong(1, 0, -6)], rules), /杠费/);
  assert.throws(() => settleSichuanDraw(players, [{ ...kong(1, 0, 6), transferred: null }], rules), /杠费/);
  assert.throws(() => settleSichuanDraw(players, [], { ...rules, baseScore: Number.MAX_SAFE_INTEGER }), /清算/);
  assert.deepEqual(players, before);
});
