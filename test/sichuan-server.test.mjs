import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.__mj = {};
await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
await import('../mockjs/browser_entry.mjs');
await import('../mock/server.js');
const { MaJiangMsg: Msg, decodeMaJiangEnvelope, encodeMaJiangEnvelope } = await import('../mockjs/majiang_pb.mjs');

const P = globalThis.__mj.proto;
const mock = globalThis.__mj.server;
mock.quiet(true);
const COIN = 60001;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function socket() {
  const frames = [];
  return { frames, readyState: 1, _deliver(bytes) { frames.push(P.dict(bytes)); } };
}

function matchRequest(roomId, gameType = 5022) {
  return P.W().s(1, P.W().v(1, gameType).v(3, 11).v(4, roomId).v(6, 1).bytes()).bytes();
}

function rpc(session, mid, seq, payload) {
  return mock.dispatch(session, P.W().v(2, mid).v(11, seq).s(3, payload).bytes()).map((bytes) => P.dict(bytes));
}

function games(frames) {
  return frames.filter((f) => f[2] === 20018).map((f) => ({ seq: f[11], ...decodeMaJiangEnvelope(f[3]) }));
}

async function until(predicate, timeout = 15_000) {
  const end = Date.now() + timeout;
  while (!predicate()) {
    if (Date.now() > end) throw new Error('等待超时');
    await wait(10);
  }
}

function setup(t) {
  const old = { ...mock.config };
  Object.assign(mock.config, { seed: 20260510, matchDelay: 0, engineStartDelay: 0, speed: 0 });
  const session = mock.createSession();
  const ws = socket();
  session.resume(ws);
  t.after(() => {
    session.destroy();
    for (const key of ['seed', 'matchDelay', 'engineStartDelay', 'speed']) mock.config[key] = old[key];
  });
  return { session, ws };
}

test('四川血战乘风房：匹配组桌、托管打完并按输赢与台费写入雀币', async (t) => {
  const { session, ws } = setup(t);
  const before = mock.userdata.inventoryCount(6, COIN);
  const ack = rpc(session, 20403, 3, matchRequest(502204));
  assert.equal(ack[0][2], 20404);
  assert.equal(ack[0][3], undefined, '准入时只回空 ack');

  await until(() => games(ws.frames).some((g) => g.cmd === Msg.ENtfToPrepare));
  const table = P.dict(P.dict(ws.frames.find((f) => f[2] === 20408)[3])[2]);
  assert.equal(table[1], 5022);
  assert.equal(table[3], 4);
  assert.equal(table[6], 11);
  assert.equal(table[8], 502204);
  assert.equal(ws.frames.filter((f) => f[2] === 20014).length, 3);
  assert.ok(ws.frames.findIndex((f) => f[2] === 20014) < ws.frames.findIndex((f) => f[2] === 20018),
    '必须先入座再推局内通知');

  const reply = rpc(session, 20018, 9, encodeMaJiangEnvelope(Msg.EReqTuoGuanChange, { tuoGuanStatus: 1 }));
  assert.deepEqual(reply, [], '局内应答经异步 push 回送');
  await until(() => games(ws.frames).some((g) => g.cmd === Msg.ENtfGameStop));
  const rsp = games(ws.frames).find((g) => g.cmd === Msg.ERspTuoGuanChange);
  assert.equal(rsp.seq, 9, '应答回显请求序号');
  assert.equal(rsp.payload.result, 0);
  assert.ok(games(ws.frames).filter((g) => g.cmd >= 1000).every((g) => g.seq === undefined), '通知不带 f11');

  const result = session.sichuan.session.result;
  const delta = result.scores[0];
  const finish = rpc(session, 20102, 10, new Uint8Array(0));
  assert.equal(finish[0][2], 20103);
  const after = mock.userdata.inventoryCount(6, COIN);
  assert.equal(after, before + delta - 1250);
  if (after !== before) assert.ok(finish[0][24] instanceof Uint8Array, '离桌应答携带雀币 DataChange');
  assert.equal(session.tableId, 0);
  assert.equal(session.sichuan, null);
  assert.deepEqual(rpc(session, 20018, 11, encodeMaJiangEnvelope(Msg.EReqTuoGuanChange, { tuoGuanStatus: 0 })), []);
});

test('四川房间按原表雀币上下限准入，未实现玩法仍不组桌', (t) => {
  const { session } = setup(t);
  const balance = mock.userdata.inventoryCount(6, COIN);
  assert.ok(balance > 40_000, '测试前提：默认存档超过启航上限');
  const rejected = rpc(session, 20403, 1, matchRequest(502202));
  assert.equal(P.dict(rejected[0][3])[1], 1);
  assert.equal(session.tableId, 0);
  assert.equal(P.dict(rpc(session, 20403, 2, matchRequest(999999))[0][3])[1], 1);
  const ignored = rpc(session, 20403, 3, matchRequest(502104, 5021));
  assert.equal(ignored[0][3], undefined);
  assert.equal(session.tableId, 0);
  assert.equal(session.matchTimer, null);
});

test('四川断线由 AI 接管，重连 20162 返回牌桌并从开牌重放', async (t) => {
  const { session, ws } = setup(t);
  mock.config.speed = 1;
  rpc(session, 20403, 3, matchRequest(502204));
  await until(() => games(ws.frames).some((g) => g.cmd === Msg.ENtfToPrepare));
  rpc(session, 20018, 4, encodeMaJiangEnvelope(Msg.EReqPrepare, {}));
  await until(() => games(ws.frames).some((g) => g.cmd === Msg.ENtfGameStart));
  assert.equal(games(ws.frames).find((g) => g.cmd === Msg.ERspPrepare)?.payload.result, 0);

  ws.readyState = 3;
  session.suspend();
  session.detachMatch();
  assert.equal(session.sichuan.session.view().autoplay, true);
  const ws2 = socket();
  session.resume(ws2);
  assert.equal(session.replaying, true, '重连到 20162 之前挂起实时下推');
  assert.equal(session.sichuan.session.view().autoplay, false);

  const resync = rpc(session, 20162, 5, new Uint8Array(0));
  const body = P.dict(resync[0][3]);
  assert.equal(body[2], 5022);
  assert.equal(body[5], 502204);
  assert.equal(P.dict(body[4])[1], 5022);
  await until(() => !session.replaying);
  await wait(20); // push 在下一轮事件循环才真正投递
  const replay = games(ws2.frames);
  assert.notEqual(replay[0].cmd, Msg.ENtfToPrepare, '已开牌不再重放准备通知');
  assert.ok(replay.some((g) => g.cmd === Msg.ENtfGameStart));
  rpc(session, 20025, 6, new Uint8Array(0));
  assert.equal(session.sichuan, null);
});
