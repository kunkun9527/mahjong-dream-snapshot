import test from 'node:test';
import assert from 'node:assert/strict';

await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
await import('../mockjs/browser_entry.mjs');
await import('../mock/server.js');
const { proto: P, server: mock } = globalThis.__mj;
mock.quiet(true);

function connection(session, received) {
  return {
    readyState: 1,
    _deliver(bytes) { received.push(P.dict(bytes)); },
  };
}

function ping(session, socket, seq) {
  const request = P.W().v(2, 20019).v(11, seq).bytes();
  for (const frame of mock.dispatch(session, request)) socket._deliver(frame);
}

test('异步牌局通知与即时心跳交错时，下行序号按实际发送顺序递增', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const session = mock.createSession();
  const received = [];
  session.socket = connection(session, received);
  const payload = mock.encodeKRiichi(1005, new Uint8Array());
  session.push(20018, payload, 1, null, null);
  ping(session, session.socket, 27);
  assert.equal(received.length, 1, '牌局推送仍须异步，避免虚拟连接同步重入');
  t.mock.timers.tick(1);
  assert.deepEqual(received.map((frame) => frame[2]), [20019, 20018]);
  assert.deepEqual(received.map((frame) => frame[27]), [1, 2]);
  assert.equal(received[0][11], 27, '心跳回显原请求序号');
  assert.equal(received[1][11], undefined, '通知不能带 RPC 序号');
  assert.deepEqual(received[1][3], payload);
});

test('多个通知和动作应答保持入队顺序，心跳不抢占它们的下行序号', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const session = mock.createSession();
  const received = [];
  session.socket = connection(session, received);
  for (const [event, seq] of [[4, 50], [1005, null], [1004, null]]) {
    session.push(20018, mock.encodeKRiichi(event, new Uint8Array()), 1, null, seq);
  }
  ping(session, session.socket, 51);
  t.mock.timers.tick(1);
  assert.deepEqual(received.map((frame) => frame[27]), [1, 2, 3, 4]);
  assert.deepEqual(received.slice(1).map((frame) => P.dict(frame[3])[1]), [4, 1005, 1004]);
  assert.deepEqual(received.map((frame) => frame[11]), [51, 50, undefined, undefined]);
});

test('断开后未投递的旧通知不消耗序号，也不泄漏到新连接', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const session = mock.createSession();
  const oldReceived = [], received = [];
  session.socket = connection(session, oldReceived);
  session.push(20018, mock.encodeKRiichi(1005, new Uint8Array()));
  session.suspend();
  session.resume(connection(session, received));
  t.mock.timers.tick(1);
  ping(session, session.socket, 1);
  assert.deepEqual(oldReceived, []);
  assert.deepEqual(received.map((frame) => frame[27]), [1]);
});
