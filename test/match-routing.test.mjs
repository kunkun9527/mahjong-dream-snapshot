import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.__mj = {};
await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
await import('../mockjs/browser_entry.mjs');
await import('../mock/server.js');

const P = globalThis.__mj.proto;
const mock = globalThis.__mj.server;
mock.quiet(true);

function request(gameType, subtype = 0) {
  const match = P.W().v(1, gameType);
  if (subtype) match.v(2, subtype);
  match.v(3, 7).v(4, 1).v(6, 1);
  return P.W().s(1, match.bytes()).bytes();
}

function route(gameType, subtype) {
  const session = mock.createSession();
  mock.handlers[20403](session, request(gameType, subtype));
  clearTimeout(session.matchTimer);
  session.matchTimer = null;
}

test('原模式页的匹配请求决定三/四麻与东风/半庄', () => {
  mock.config.playersExplicit = false;
  mock.config.matchLengthExplicit = false;
  route(4002, 1);
  assert.equal(mock.config.players, 3);
  assert.equal(mock.config.matchLength, 'hanchan');

  route(4001, 0);
  assert.equal(mock.config.players, 4);
  assert.equal(mock.config.matchLength, 'east');
});

test('显式 URL 模式参数优先于原模式页请求', () => {
  mock.config.players = 4;
  mock.config.matchLength = 'east';
  mock.config.playersExplicit = true;
  mock.config.matchLengthExplicit = true;
  route(4002, 1);
  assert.equal(mock.config.players, 4);
  assert.equal(mock.config.matchLength, 'east');

  mock.config.playersExplicit = false;
  mock.config.matchLengthExplicit = false;
});

test('未实现请求返回明确失败而不是空成功', () => {
  const session = mock.createSession();
  const frames = mock.dispatch(session, P.W().v(2, 199998).v(11, 42).s(3, new Uint8Array(0)).bytes());
  assert.equal(frames.length, 1);
  const wrapper = P.dict(frames[0]);
  assert.equal(wrapper[2], 199999);
  assert.equal(wrapper[11], 42);
  assert.equal(P.dict(wrapper[3])[1], 1);
});

test('固定种子同时固定牌桌标识与 AI 外观', async () => {
  const oldSeed = mock.config.seed;
  const oldMatchDelay = mock.config.matchDelay;
  const oldEngineStartDelay = mock.config.engineStartDelay;
  mock.config.seed = 123456;
  mock.config.matchDelay = 0;
  mock.config.engineStartDelay = 1_000;
  async function formTable() {
    const session = mock.createSession();
    session.socket = { readyState: 1, _deliver() {} };
    mock.handlers[20403](session, request(4001, 0));
    await new Promise((resolve) => setTimeout(resolve, 10));
    const table = structuredClone(session.table);
    session.destroy();
    return table;
  }
  try {
    const first = await formTable();
    const second = await formTable();
    assert.equal(first.seed, 123456);
    assert.deepEqual(second, first);
  } finally {
    mock.config.seed = oldSeed;
    mock.config.matchDelay = oldMatchDelay;
    mock.config.engineStartDelay = oldEngineStartDelay;
  }
});


test('组桌完成后取消匹配不会被延迟任务幽灵开局', async () => {
  const oldMatchDelay = mock.config.matchDelay;
  const oldEngineStartDelay = mock.config.engineStartDelay;
  mock.config.matchDelay = 0;
  mock.config.engineStartDelay = 30;
  const session = mock.createSession();
  session.socket = { readyState: 1, _deliver() {} };
  try {
    mock.handlers[20403](session, request(4001, 0));
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.ok(session.engineStartTimer);
    mock.handlers[20405](session);
    await new Promise((resolve) => setTimeout(resolve, 40));
    assert.equal(session.tableId, 0);
    assert.equal(session.engineStartTimer, null);
    assert.equal(session.riichi, null);
  } finally {
    session.destroy();
    mock.config.matchDelay = oldMatchDelay;
    mock.config.engineStartDelay = oldEngineStartDelay;
  }
});

test('短时连续资料查询正常响应，不得通过断线重置正在进行的牌局', () => {
  const session = mock.createSession();
  const closed = [];
  session.socket = { readyState: 1, close(...args) { closed.push(args); } };
  session.tableId = 123;
  const query = P.W().s(2, P.W().v(1, 39).bytes()).bytes();
  try {
    const responses = Array.from({ length: 20 }, () => mock.handlers[100141](session, query));
    assert.deepEqual(closed, []);
    assert.ok(responses.every((frames) => frames.length > 0 && frames[0][0] === 100142));
    assert.equal(session.tableId, 123);
  } finally {
    session.destroy();
  }
});
