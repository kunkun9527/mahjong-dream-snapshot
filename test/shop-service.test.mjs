import test from 'node:test';
import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { watch } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { WebSocket } from 'ws';
import { createDefaultProfile, saveProfile } from '../local/profile.mjs';

await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
const { proto: P, data, userdata: U } = globalThis.__mj;

async function launch(directory) {
  const child = fork(new URL('../local/server.mjs', import.meta.url), {
    env: { ...process.env, MJ_PORT: '0', MJ_USERDATA_DIR: directory },
    execArgv: [], stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });
  let errors = '';
  child.stderr.on('data', (chunk) => { errors += chunk; });
  child.stdout.resume();
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`服务启动超时: ${errors}`)), 10000);
    child.once('error', (error) => { clearTimeout(timer); reject(error); });
    child.once('exit', (code) => { clearTimeout(timer); reject(new Error(`服务提前退出${code}: ${errors}`)); });
    child.on('message', (message) => {
      if (message?.type === 'ready') { clearTimeout(timer); resolve(message.url); }
    });
  }).catch((error) => { child.kill(); throw error; });
  return { child, url, diagnostics: () => errors };
}
async function stop(child) {
  if (child.exitCode !== null) return;
  const exited = new Promise((resolve) => child.once('exit', resolve));
  child.kill('SIGTERM');
  await exited;
}
async function connect(url) {
  const socket = new WebSocket(url.replace('http:', 'ws:') + 'ws');
  await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
  return socket;
}
function rpc(socket, mid, payload, seq) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error('购物响应超时')); }, 5000);
    const receive = (bytes) => {
      const frame = P.dict(new Uint8Array(bytes));
      if (frame[2] !== mid + 1 || frame[11] !== seq) return;
      cleanup(); resolve(frame);
    };
    const fail = (error) => { cleanup(); reject(error); };
    const cleanup = () => { clearTimeout(timer); socket.off('message', receive); socket.off('error', fail); };
    socket.on('message', receive); socket.on('error', fail);
    socket.send(P.W().v(2, mid).v(11, seq).s(3, payload).bytes());
  });
}
function savedWhen(directory, predicate) {
  return new Promise((resolve, reject) => {
    const watcher = watch(directory, () => { void check(); });
    const timer = setTimeout(async () => {
      watcher.close();
      const latest = JSON.parse(await fs.readFile(path.join(directory, 'profile.json'), 'utf8'));
      const user = new U.UserData(Buffer.from(latest.lobbyData, 'base64'), 349804);
      reject(new Error(`购物数据未落盘，最新余额: ${[60001, 60002, 60009, 60012].map((id) => `${id}=${user.inventoryCount(6, id)}`).join(', ')}`));
    }, 5000);
    async function check() {
      try {
        const profile = JSON.parse(await fs.readFile(path.join(directory, 'profile.json'), 'utf8'));
        if (predicate(profile)) { clearTimeout(timer); watcher.close(); resolve(profile); }
      } catch (error) {
        if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) {
          clearTimeout(timer); watcher.close(); reject(error);
        }
      }
    }
    void check();
  });
}

test('真实回环服务升级旧档案，四商店购买落盘后重启不返还货币', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mj-shop-service-'));
  let current, socket;
  try {
    const profile = createDefaultProfile();
    profile.nickname = '购物测试档案';
    profile.ranks = { yonma: { level: 1, point: 0 }, sanma: { level: 2, point: 0 } };
    profile.stats.sanma.games = 4;
    const original = new U.UserData(P.b64decode(data.userdataB64), 349804);
    original.setRow(6, 60001, P.W().v(1, 60001).v(2, 123456).bytes());
    profile.lobbyData = Buffer.from(original.serialize()).toString('base64');
    await saveProfile(directory, profile);
    current = await launch(directory);
    const initialized = JSON.parse(await fs.readFile(path.join(directory, 'profile.json'), 'utf8'));
    assert.deepEqual(initialized.ranks, { yonma: { level: 17, point: 2300 }, sanma: { level: 17, point: 2300 } });
    assert.equal(initialized.offlineEconomyVersion, 1);
    socket = await connect(current.url);
    let frame = await rpc(socket, 100141, new Uint8Array(), 1);
    const user = new U.UserData(frame[3], 349804);
    assert.equal(user.inventoryCount(6, 60001), 12345600);
    assert.equal(user.inventoryCount(6, 60002), 999999);
    assert.equal(P.get(user.row(41, '4001'), 1), 17);
    assert.equal(P.get(user.row(41, '4002'), 2), 2300);
    const coinItem = P.dict(P.parse(user.row(30, '0')).find(([n]) => n === 1)[2]);
    const purchases = [[2, 60007], [1, 80001], [7, 70018], [5, coinItem[1]]];
    let seq = 2;
    for (const [type, id] of purchases) {
      frame = await rpc(socket, 100500, P.W().v(1, type).v(2, id).v(3, 1).v(4, 1).bytes(), seq++);
      assert.equal(P.get(frame[3], 1), 0);
      assert.ok(frame[24]);
    }
    const saved = await savedWhen(directory, (value) => {
      const state = new U.UserData(Buffer.from(value.lobbyData, 'base64'), 349804);
      return state.inventoryCount(6, 60001) === 12345600 - coinItem[5];
    });
    const bought = new U.UserData(Buffer.from(saved.lobbyData, 'base64'), 349804);
    assert.equal(bought.inventoryCount(6, 60002), 999499);
    assert.equal(bought.inventoryCount(6, 60009), 999998);
    assert.equal(bought.inventoryCount(6, 60012), 999989);
    for (const [dtype, id] of [[6, 60007], [8, 80001], [7, 70018], [coinItem[2], coinItem[1]]]) {
      assert.equal(bought.inventoryCount(dtype, id), user.inventoryCount(dtype, id) + 1);
    }
    socket.terminate(); socket = null;
    await stop(current.child); current = null;
    current = await launch(directory);
    socket = await connect(current.url);
    frame = await rpc(socket, 100141, new Uint8Array(), 1);
    const restored = new U.UserData(frame[3], 349804);
    for (const id of [60001, 60002, 60009, 60012]) {
      assert.equal(restored.inventoryCount(6, id), bought.inventoryCount(6, id));
    }
    assert.equal(saved.nickname, '购物测试档案');
    assert.equal(saved.stats.sanma.games, 4);
    assert.equal(saved.version, 1);
  } catch (error) {
    error.message += '\n' + (current?.diagnostics() || '');
    throw error;
  } finally {
    socket?.terminate();
    if (current) await stop(current.child);
    await fs.rm(directory, { recursive: true, force: true });
  }
});
