import test from 'node:test';
import assert from 'node:assert/strict';

await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
const { proto: P, data, userdata: U } = globalThis.__mj;
const fresh = () => new U.UserData(P.b64decode(data.userdataB64), 10_000_001);

test('扣款和发货一起提交，同一物品变化合并且保留未知字段', () => {
  const user = fresh();
  user.setRow(6, 60001, P.W().v(1, 60001).v(2, 1000).v(9, 42).bytes());
  const gifts = user.inventoryCount(7, 70011);
  const version = user.modules[6].version;
  const changes = user.changeInventory([
    { dtype: 6, id: 60001, count: -100 },
    { dtype: 7, id: 70011, count: 2 },
    { dtype: 6, id: 60001, count: -200 },
  ]);
  assert.equal(user.inventoryCount(6, 60001), 700);
  assert.equal(user.inventoryCount(7, 70011), gifts + 2);
  assert.equal(P.get(user.row(6, 60001), 9), 42);
  assert.equal(user.modules[6].version, version + 1);
  assert.equal(changes[6].length, 1);
  assert.ok(P.get(user.changeNotify(changes), 1));
  const restored = new U.UserData(user.serialize(), user.uid);
  assert.equal(restored.inventoryCount(6, 60001), 700);
  assert.equal(restored.inventoryCount(7, 70011), gifts + 2);
});

test('余额不足或发货溢出时整个背包和模块版本完全不变', () => {
  const user = fresh();
  user.setRow(8, 80005, P.W().v(1, 80005).v(2, Number.MAX_SAFE_INTEGER).bytes());
  const before = user.serialize();
  for (const deltas of [
    [{ dtype: 7, id: 70011, count: 1 }, { dtype: 6, id: 60001, count: -user.inventoryCount(6, 60001) - 1 }],
    [{ dtype: 6, id: 60001, count: -1 }, { dtype: 8, id: 80005, count: 1 }],
    [{ dtype: 6, id: 60001, count: -1 }, { dtype: 7, id: 70011, count: 0.5 }],
    [{ dtype: 6, id: 60001, count: -1 }, { dtype: 26, id: 26001, count: 1 }],
  ]) {
    assert.throws(() => user.changeInventory(deltas), RangeError);
    assert.deepEqual(user.serialize(), before);
  }
});

test('首次获得物品使用 ADD 增量，零净变化不增加模块版本', () => {
  const user = fresh();
  const id = 69999;
  assert.equal(user.inventoryCount(6, id), 0);
  const changes = user.changeInventory([{ dtype: 6, id, count: 2 }]);
  assert.equal(changes[6][0][2], 1);
  assert.equal(P.get(user.row(6, id), 1), id);
  assert.equal(user.inventoryCount(6, id), 2);
  const before = user.serialize();
  assert.equal(user.changeInventory([{ dtype: 6, id, count: 1 }, { dtype: 6, id, count: -1 }]), null);
  assert.deepEqual(user.serialize(), before);
});
