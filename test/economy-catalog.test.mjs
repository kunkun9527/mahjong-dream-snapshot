import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { ECONOMY_CATALOG as C } from '../mockjs/economy_catalog.mjs';
import { applyRankResult, createDefaultProfile } from '../local/profile.mjs';

test('商品目录绑定原始bundle，关键字段不是FlatBuffers地址或排序号', async () => {
  const bytes = await fs.readFile(new URL('../' + C.source, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), C.sha256);
  const protocol = await fs.readFile(new URL('../' + C.protocolSource, import.meta.url));
  assert.equal(createHash('sha256').update(protocol).digest('hex'), C.protocolSha256);
  assert.deepEqual(C.shopTypes, { GROCERY: 2, COIN: 5, RECRUIT: 1, HONOR: 7 });
  assert.deepEqual(C.grocery.find((item) => item.id === 60008), {
    id: 60008, type: 6, tokenType: 1, price: 50, buyType: 2, limit: 1, sort: 60001,
  });
  assert.deepEqual(C.honor.find((item) => item.id === 70018), {
    id: 70018, type: 7, price: 10, buyType: 2, limit: 5, sort: 70015, gears: [],
  });
  assert.equal(C.recruit.find((item) => item.id === 80009).price, 15);
  assert.equal(C.gifts.find((item) => item.id === 71019).price, 150000);
});

test('新档案三四麻均为七段2300PT，按原上下限开放乘风和御龙', () => {
  const profile = createDefaultProfile();
  assert.deepEqual(profile.ranks, { yonma: { level: 17, point: 2300 }, sanma: { level: 17, point: 2300 } });
  assert.equal(profile.coins, 999999);
  assert.deepEqual(C.dojos.filter((room) => room.minRank <= 17 && room.maxRank >= 17).map((room) => room.id), [3, 4]);
  assert.equal(C.yonmaRanks[16].initial, 2300);
  assert.equal(C.sanmaRanks[16].up, 4600);
});

test('初始PT不是降段底线，七段在4600PT才升八段', () => {
  const profile = createDefaultProfile();
  profile.ranks.yonma.point = 2000;
  const loss = applyRankResult(profile, { players: 4, matchLength: 'east', placement: 4 });
  assert.equal(loss.oldPoint, 2000);
  assert.equal(loss.level, 17);
  assert.equal(loss.point, 1815);
  profile.ranks.yonma.point = 2800;
  assert.equal(applyRankResult(profile, { players: 4, matchLength: 'east', placement: 1 }).level, 17);
  profile.ranks.yonma.point = 4599;
  const promoted = applyRankResult(profile, { players: 4, matchLength: 'east', placement: 1 });
  assert.equal(promoted.level, 18);
  assert.equal(promoted.point, 2800);
  profile.ranks.yonma = { level: 17, point: 1 };
  const demoted = applyRankResult(profile, { players: 4, matchLength: 'east', placement: 4 });
  assert.equal(demoted.level, 16);
  assert.equal(demoted.point, 1800);
});

test('乘风与御龙使用各自原表PT，三四麻和东风半庄不混用', () => {
  for (const [players, matchLength, roomId, expected] of [
    [4, 'east', 3, 130], [4, 'east', 4, 200],
    [4, 'hanchan', 3, 195], [4, 'hanchan', 4, 300],
    [3, 'east', 3, 90], [3, 'east', 4, 160],
    [3, 'hanchan', 3, 135], [3, 'hanchan', 4, 240],
  ]) {
    assert.equal(applyRankResult(createDefaultProfile(), { players, matchLength, roomId, placement: 1 }).change, expected);
  }
});

test('雀梦之巅过渡段继承PT，进入和退出最高档按原表转换', () => {
  const profile = createDefaultProfile();
  profile.ranks.yonma = { level: 20, point: 7599 };
  const inherited = applyRankResult(profile, { players: 4, matchLength: 'east', placement: 1 });
  assert.equal(inherited.level, 21);
  assert.equal(inherited.point, inherited.oldPoint + inherited.change);
  profile.ranks.yonma = { level: 21, point: 8599 };
  const highest = applyRankResult(profile, { players: 4, matchLength: 'east', placement: 1 });
  assert.equal(highest.level, 22);
  assert.equal(highest.point, 50);
  profile.ranks.yonma.point = 0;
  const down = applyRankResult(profile, { players: 4, matchLength: 'east', placement: 4 });
  assert.equal(down.level, 21);
  assert.equal(down.point, 8500);
});
