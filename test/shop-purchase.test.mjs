import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeOfflineEconomy } from '../local/economy.mjs';
import { createDefaultProfile } from '../local/profile.mjs';
import { ECONOMY_CATALOG as C } from '../mockjs/economy_catalog.mjs';
import { purchase, refreshShop, synchronizeShop } from '../mockjs/shop.mjs';

await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
await import('../mockjs/browser_entry.mjs');
await import('../mock/server.js');
const { proto: P, data, userdata: U, server } = globalThis.__mj;
server.quiet(true);
const NOW = Date.UTC(2026, 9, 15, 4) / 1000;
function fresh(now = NOW) {
  const user = new U.UserData(P.b64decode(data.userdataB64), 349804);
  initializeOfflineEconomy(createDefaultProfile(), user, C.defaults);
  synchronizeShop(user, now);
  return user;
}
const request = (shopType, itemId, quantity = 1, extra = {}) => ({ shopType, itemId, quantity, exchangeCount: 1, ...extra });
const stock = (user) => P.parse(user.row(30, '0')).filter(([n]) => n === 1).map(([, , bytes]) => P.dict(bytes));
function wire(session, type, id, count = 1, seq = 1, raw = null, mid = 100500) {
  const payload = raw ?? P.W().v(1, type).v(2, id).v(3, count).v(4, 1).bytes();
  return P.dict(server.dispatch(session, P.W().v(2, mid).v(11, seq).s(3, payload).bytes())[0]);
}

for (const [name, type, id, currency, price, dtype, count] of [
  ['杂货铺改名卡', 2, 60007, 60002, 500, 6, 2],
  ['杂货铺每日招募卡', 2, 60008, 60001, 50, 6, 1],
  ['招募商店六德之证', 1, 80001, 60009, 1, 8, 3],
  ['招募商店雀士碎片', 1, 80009, 60009, 15, 8, 2],
  ['荣耀积分礼物', 7, 70018, 60012, 10, 7, 2],
]) {
  test(`${name}按真实单价和数量扣款发货并返回完整协议增量`, () => {
    const user = fresh(Math.floor(Date.now() / 1000));
    server.setUserdata(user.serialize());
    const beforeMoney = server.userdata.inventoryCount(6, currency);
    const beforeItems = server.userdata.inventoryCount(dtype, id);
    const frame = wire(server.createSession(), type, id, count, 27);
    assert.equal(frame[2], 100501);
    assert.equal(frame[11], 27);
    const body = P.dict(frame[3]);
    assert.equal(body[1] || 0, 0);
    assert.equal(body[2], id);
    assert.equal(body[3], count);
    assert.deepEqual(P.dict(body[4]), { 1: id, 2: count });
    assert.equal(server.userdata.inventoryCount(6, currency), beforeMoney - price * count);
    assert.equal(server.userdata.inventoryCount(dtype, id), beforeItems + count);
    const packet = P.dict(P.get(frame[24], 1));
    assert.equal(packet[1], server.userdata.uid);
    const modules = P.parse(P.get(frame[24], 1)).filter(([n]) => n === 2).map(([, , bytes]) => P.dict(bytes));
    assert.ok(modules.some((module) => module[1] === 30));
    for (const module of modules) assert.equal(module[2], server.userdata.modules[module[1]].version);
  });
}

test('雀币商店八槽位遵守原稀有度和单价，售罄后拒绝多买', () => {
  const user = fresh();
  const items = stock(user);
  assert.equal(items.length, 8);
  assert.equal(new Set(items.map((item) => item[1])).size, 8);
  for (let i = 0; i < items.length; i++) {
    assert.equal(items[i][2], C.coinSlots[i].type);
    assert.equal(items[i][3], C.coinSlots[i].rarity);
    assert.equal(items[i][4], C.coinSlots[i].count);
  }
  const item = items[2];
  const money = user.inventoryCount(6, 60001);
  const before = user.inventoryCount(7, item[1]);
  assert.equal(purchase(user, request(5, item[1], item[4]), NOW).error, 0);
  assert.equal(user.inventoryCount(6, 60001), money - item[5] * item[4]);
  assert.equal(user.inventoryCount(7, item[1]), before + item[4]);
  const saved = user.serialize();
  assert.equal(purchase(user, request(5, item[1]), NOW).error, 2011);
  assert.deepEqual(user.serialize(), saved);
});

test('非法商品、数量、份数、档位和余额不足均不改变任何模块', () => {
  const user = fresh();
  const money = user.inventoryCount(6, 60002);
  user.changeInventory([{ dtype: 6, id: 60002, count: -money }]);
  const saved = user.serialize();
  for (const [req, code] of [
    [request(2, 60007), 2010], [request(2, 60008, 2), 2011],
    [request(7, 70018, 6), 2011], [request(2, 999999), 2012],
    [request(6, 60001), 2012], [request(1, 80001, 0), 1],
    [request(1, 80001, -1), 1], [request(1, 80001, 1.5), 1],
    [request(1, 80001, 2 ** 32), 1], [request(1, 80001, 1, { exchangeCount: 2 }), 1],
    [request(1, 80001, 1, { gearIndex: 1 }), 1],
  ]) {
    assert.equal(purchase(user, req, NOW).error, code);
    assert.deepEqual(user.serialize(), saved);
  }
});

test('唯一角色与装扮已拥有时不重复扣钱，缺少时正确发放且可再次判重', () => {
  for (const [type, id, dtype] of [[1, 1, 26], [1, 140002, 14], [7, 150007, 15], [1, 170002, 17]]) {
    const user = fresh();
    const saved = user.serialize();
    assert.equal(purchase(user, request(type, id), NOW).error, 2011);
    assert.deepEqual(user.serialize(), saved);
    if (dtype === 26) {
      delete user.modules[26].rows[String(id)];
      user.modules[26].order = user.modules[26].order.filter((key) => key !== String(id));
    } else {
      const w = P.W();
      for (const field of P.parse(user.row(dtype, '0'))) {
        if (field[0] !== 1 || P.get(field[2], 1) !== id) P.reencode(w, ...field);
      }
      user.setRow(dtype, '0', w.bytes());
    }
    const result = purchase(user, request(type, id), NOW);
    assert.equal(result.error, 0);
    assert.ok(result.changes[dtype]);
    assert.equal(purchase(user, request(type, id), NOW).error, 2011);
  }
});

test('杂货每日限购与荣耀每月限购分别重置，重启不重置同周期消费', () => {
  let user = fresh();
  assert.equal(purchase(user, request(2, 60008), NOW).error, 0);
  assert.equal(purchase(user, request(7, 70018, 5), NOW).error, 0);
  user = new U.UserData(user.serialize(), user.uid);
  assert.equal(purchase(user, request(2, 60008), NOW + 1).error, 2011);
  assert.equal(purchase(user, request(7, 70018), NOW + 86400).error, 2011);
  assert.equal(purchase(user, request(2, 60008), NOW + 86400).error, 0);
  const nextMonth = Date.UTC(2026, 10, 1) / 1000 - 8 * 3600;
  assert.equal(purchase(user, request(7, 70018), nextMonth).error, 0);
});

test('刷新首笔免费，然后5000雀币、10梦石，日界后恢复免费额度', () => {
  const user = fresh();
  const coin = user.inventoryCount(6, 60001), stone = user.inventoryCount(6, 60002);
  assert.equal(refreshShop(user, NOW).error, 0);
  assert.equal(user.inventoryCount(6, 60001), coin);
  assert.equal(P.get(user.row(30, '0'), 4), 1);
  assert.equal(refreshShop(user, NOW).error, 0);
  assert.equal(user.inventoryCount(6, 60001), coin - 5000);
  assert.equal(refreshShop(user, NOW).error, 0);
  assert.equal(user.inventoryCount(6, 60002), stone - 10);
  assert.equal(refreshShop(user, NOW + 86400).error, 0);
  assert.equal(user.inventoryCount(6, 60002), stone - 10);
  assert.equal(P.get(user.row(30, '0'), 4), 1);
  assert.equal(synchronizeShop(user, NOW + 86400), null);
});

test('同连接相同RPC重试不重复扣款，序号冲突拒绝，新连接可复用序号', () => {
  server.setUserdata(fresh(Math.floor(Date.now() / 1000)).serialize());
  const session = server.createSession();
  const coin = server.userdata.inventoryCount(6, 60009);
  assert.equal(P.get(wire(session, 1, 80001, 3)[3], 1), 0);
  const saved = server.userdata.serialize();
  assert.equal(P.get(wire(session, 1, 80001, 3)[3], 1), 0);
  assert.deepEqual(server.userdata.serialize(), saved);
  assert.equal(P.get(wire(session, 1, 80001, 4)[3], 1), 1);
  assert.deepEqual(server.userdata.serialize(), saved);
  session.resume({ readyState: 1, _deliver() {} });
  assert.equal(P.get(wire(session, 1, 80001, 3)[3], 1), 0);
  assert.equal(server.userdata.inventoryCount(6, 60009), coin - 6);
});

test('恶意wire字段返回非零结果，不触发通用异常路径的假成功', () => {
  server.setUserdata(fresh().serialize());
  const saved = server.userdata.serialize();
  const malformedWrapper = P.W().v(2, 100500).v(11, 1).v(3, 123).bytes();
  const rejected = P.dict(server.dispatch(server.createSession(), malformedWrapper)[0]);
  assert.equal(P.get(rejected[3], 1), 1);
  assert.equal(rejected[24], undefined);
  assert.deepEqual(server.userdata.serialize(), saved);
  for (const payload of [
    Uint8Array.of(0x80),
    P.W().v(1, 1).v(1, 5).v(2, 80001).v(3, 1).v(4, 1).bytes(),
    P.W().v(1, 1).s(2, '80001').v(3, 1).v(4, 1).bytes(),
    P.W().v(1, 1).v(2, 80001).v(3, 1).v(4, 1).s(6, 'mock-mould').bytes(),
  ]) {
    const frame = wire(server.createSession(), 0, 0, 0, 1, payload);
    assert.equal(P.get(frame[3], 1), 1);
    assert.equal(frame[24], undefined);
    assert.deepEqual(server.userdata.serialize(), saved);
  }
});
