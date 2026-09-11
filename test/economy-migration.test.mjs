import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDefaultProfile, loadProfile, saveProfile } from '../local/profile.mjs';
import { initializeOfflineEconomy } from '../local/economy.mjs';

await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
const { proto: P, data, userdata: U } = globalThis.__mj;
// 此处为迁移机制的 mock 配置；真实段位/货币映射由商店目录回归另外验证。
const config = { coinId: 60001, currencyIds: [60001, 60002, 60008], rank: { level: 17, point: 2000 } };
const fresh = () => new U.UserData(P.b64decode(data.userdataB64), 10_000_001);

test('旧档案一次性补给并升级三四麻，不覆盖昵称装备与战绩', () => {
  const profile = createDefaultProfile();
  profile.nickname = '测试档案';
  profile.stats.sanma.games = 7;
  profile.ranks.sanma = { level: 2, point: 0 };
  profile.coins = 500;
  const user = fresh();
  const equipment = user.row(1, '0');
  const before = user.inventoryCount(6, config.coinId);
  assert.equal(initializeOfflineEconomy(profile, user, config), true);
  assert.equal(profile.coins, 999999);
  assert.deepEqual(profile.ranks, { yonma: config.rank, sanma: config.rank });
  assert.equal(user.inventoryCount(6, config.coinId), before * 100);
  assert.equal(user.inventoryCount(6, 60002), 999999);
  assert.equal(user.inventoryCount(6, 60008), 999999);
  assert.equal(profile.nickname, '测试档案');
  assert.equal(profile.stats.sanma.games, 7);
  assert.deepEqual(user.row(1, '0'), equipment);
});

test('新档案补给后消费和降段，原子保存再载入不重复补满', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mj-economy-'));
  try {
    const profile = createDefaultProfile();
    const user = fresh();
    initializeOfflineEconomy(profile, user, config);
    user.changeInventory([{ dtype: 6, id: 60002, count: -999900 }]);
    profile.ranks.yonma = { level: 16, point: 1300 };
    profile.coins = 321;
    profile.lobbyData = Buffer.from(user.serialize()).toString('base64');
    await saveProfile(directory, profile);
    const loaded = await loadProfile(directory);
    const restored = new U.UserData(Buffer.from(loaded.lobbyData, 'base64'), user.uid);
    assert.equal(initializeOfflineEconomy(loaded, restored, config), false);
    assert.equal(restored.inventoryCount(6, 60002), 99);
    assert.deepEqual(loaded.ranks.yonma, { level: 16, point: 1300 });
    assert.equal(loaded.coins, 321);
    assert.deepEqual(restored.serialize(), user.serialize());
    assert.deepEqual(await fs.readdir(directory), ['profile.json']);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('迁移余额溢出时档案和大厅快照都不变，也不写完成标记', () => {
  const profile = createDefaultProfile();
  const user = fresh();
  user.setRow(6, config.coinId, P.W().v(1, config.coinId).v(2, Number.MAX_SAFE_INTEGER).bytes());
  const beforeProfile = structuredClone(profile);
  const beforeUser = user.serialize();
  assert.throws(() => initializeOfflineEconomy(profile, user, config), RangeError);
  assert.deepEqual(profile, beforeProfile);
  assert.deepEqual(user.serialize(), beforeUser);
});
