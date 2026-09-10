import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fork } from 'node:child_process';
import { WebSocket } from 'ws';

import { applyRankResult, createDefaultProfile, loadProfile, recordMatch, sanitizeNickname, saveProfile } from '../local/profile.mjs';
await import('../mock/proto.js');
const P = globalThis.__mj.proto;


test('本地档案原子写入并保留设置与累计成绩', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mj-profile-'));
  try {
    const profile = createDefaultProfile();
    profile.settings.internalState[3] = true;
    const result = recordMatch(profile, {
      players: 4, matchLength: 'hanchan', scores: [31_000, 29_000, 22_000, 18_000],
      matchStats: { hands: 8, wins: 2, dealIns: 1, riichi: 3, calls: 2, tsumo: 1, ron: 1, winPoints: 12_000, winTurns: 19, maxRenchan: 2 },
    });
    await saveProfile(directory, profile);
    const loaded = await loadProfile(directory);
    assert.equal(result.placement, 1);
    assert.equal(result.coins, 100);
    assert.equal(result.rank.change, 30);
    assert.equal(loaded.coins, 100);
    assert.equal(loaded.stats.yonma.hanchanGames, 1);
    assert.equal(loaded.stats.yonma.placements[0], 1);
    assert.equal(loaded.stats.yonma.hands, 8);
    assert.equal(loaded.stats.yonma.wins, 2);
    assert.equal(loaded.stats.yonma.maxRenchan, 2);
    assert.equal(loaded.stats.yonma.byLength.hanchan.games, 1);
    assert.equal(loaded.stats.yonma.byLength.hanchan.hands, 8);
    assert.equal(loaded.stats.yonma.byLength.hanchan.placements[0], 1);
    assert.equal(loaded.settings.internalState[3], true);
    assert.equal(sanitizeNickname('  离线雀士  '), '离线雀士');
    assert.equal(sanitizeNickname(' \n '), null);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
test('损坏存档会保留备份并回退到新档案', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mj-corrupt-profile-'));
  try {
    await fs.writeFile(path.join(directory, 'profile.json'), '{broken', 'utf8');
    const profile = await loadProfile(directory);
    assert.equal(profile.nickname, '离线玩家');
    const files = await fs.readdir(directory);
    assert.equal(files.includes('profile.json'), false);
    assert.equal(files.filter((name) => name.startsWith('profile.corrupt-')).length, 1);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});



test('段位 PT 使用资源表并正确升降段', () => {
  const profile = createDefaultProfile();
  profile.ranks.yonma = { level: 11, point: 390 };
  assert.deepEqual(applyRankResult(profile, { players: 4, matchLength: 'east', placement: 1 }), {
    oldLevel: 11, oldPoint: 390, level: 12, point: 400, change: 40, name: '二段',
  });
  profile.ranks.yonma = { level: 12, point: 405 };
  assert.deepEqual(applyRankResult(profile, { players: 4, matchLength: 'east', placement: 4 }), {
    oldLevel: 12, oldPoint: 405, level: 11, point: 399, change: -40, name: '初段',
  });
  profile.ranks.sanma = { level: 20, point: 2_100 };
  assert.equal(applyRankResult(profile, { players: 3, matchLength: 'hanchan', placement: 3 }).change, -180);
});

test('loopback 服务提供静态文件、WebSocket，并拒绝第二活动页面', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mj-service-'));
  const child = fork(new URL('../local/server.mjs', import.meta.url), {
    env: { ...process.env, MJ_PORT: '0', MJ_USERDATA_DIR: directory },
    execArgv: [],
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('本地服务启动超时')), 10_000);
    child.once('error', reject);
    child.on('message', (message) => {
      if (message?.type !== 'ready') return;
      clearTimeout(timer);
      resolve(message.url);
    });
  });
  try {
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /激情麻将/);

    const readme = await fs.readFile(new URL('../README.md', import.meta.url));
    const suffix = await fetch(`${url}README.md`, { headers: { Range: 'bytes=-12' } });
    assert.equal(suffix.status, 206);
    assert.equal(suffix.headers.get('content-range'), `bytes ${readme.length - 12}-${readme.length - 1}/${readme.length}`);
    assert.deepEqual(Buffer.from(await suffix.arrayBuffer()), readme.subarray(-12));
    const rangeHead = await fetch(`${url}README.md`, { method: 'HEAD', headers: { Range: 'bytes=0-9' } });
    assert.equal(rangeHead.status, 206);
    assert.equal(rangeHead.headers.get('content-length'), '10');
    assert.equal((await rangeHead.arrayBuffer()).byteLength, 0);
    assert.equal((await fetch(`${url}README.md`, { headers: { Range: 'bytes=-0' } })).status, 416);

    const first = new WebSocket(url.replace('http:', 'ws:') + 'ws');
    await new Promise((resolve, reject) => {
      first.once('open', resolve);
      first.once('error', reject);
    });
    const reply = new Promise((resolve, reject) => {
      first.once('message', (data) => resolve(new Uint8Array(data)));
      first.once('error', reject);
    });
    first.send(P.W().v(2, 100141).v(11, 7).s(3, new Uint8Array(0)).bytes());
    const responseFields = P.dict(await reply);
    assert.equal(responseFields[2], 100142);
    assert.equal(responseFields[11], 7);
    assert.ok(responseFields[3] instanceof Uint8Array && responseFields[3].length > 0);
    const secondStatus = await new Promise((resolve) => {
      const second = new WebSocket(url.replace('http:', 'ws:') + 'ws');
      second.once('unexpected-response', (_request, response2) => resolve(response2.statusCode));
      second.once('error', () => resolve(0));
    });
    assert.equal(secondStatus, 409);
    first.close();
  } finally {
    child.kill('SIGTERM');
    await new Promise((resolve) => child.once('exit', resolve));
    await fs.rm(directory, { recursive: true, force: true });
  }
});
