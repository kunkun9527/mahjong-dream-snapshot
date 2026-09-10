import test from 'node:test';
import assert from 'node:assert/strict';

await import('../mock/proto.js');
const P = globalThis.__mj.proto;

test('schema-less protobuf 精确往返 int64、fixed64 与 uint32', () => {
  const negativeOne = P.W().v(1, -1).bytes();
  const negativeTwo = P.W().v(1, -2).bytes();
  assert.notDeepEqual([...negativeOne], [...negativeTwo]);
  assert.equal(P.parse(negativeOne)[0][2], 18_446_744_073_709_551_615n);
  const fixed = 9_007_199_254_740_999n;
  assert.equal(P.parse(P.W().f64(2, fixed).bytes())[0][2], fixed);
  assert.equal(P.parse(P.W().f32(3, 0xffff_ffff).bytes())[0][2], 0xffff_ffff);
});

test('setVarint 与 setBytes 会替换全部旧标量而不被 last-one-wins 覆盖', () => {
  const source = P.W().v(1, 1).v(1, 2).s(2, 'old-a').s(2, 'old-b').bytes();
  const changedVarint = P.setVarint(source, 1, 9);
  assert.deepEqual(P.parse(changedVarint).filter(([field]) => field === 1).map(([, , value]) => value), [9]);
  const changedBytes = P.setBytes(changedVarint, 2, P.utf8('new'));
  assert.deepEqual(P.parse(changedBytes).filter(([field]) => field === 2).map(([, , value]) => P.fromUtf8(value)), ['new']);
});
