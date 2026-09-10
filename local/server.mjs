import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';

import { loadProfile, saveProfile, recordMatch } from './profile.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredResources = ['index.html', 'game.html', 'Build/mj-h5.loader.js'];
for (const resource of requiredResources) {
  try { await fsp.access(path.join(root, resource)); }
  catch { throw new Error(`[local] 缺少游戏资源：${resource}。请重新解压完整游戏目录。`); }
}
const userdataDirectory = process.env.MJ_USERDATA_DIR ? path.resolve(process.env.MJ_USERDATA_DIR) : path.join(root, 'userdata');
const profile = await loadProfile(userdataDirectory);

globalThis.location = { search: '' };
await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');
await import('../mockjs/browser_entry.mjs');
await import('../mock/server.js');

const mock = globalThis.__mj.server;
mock.quiet(process.env.MJ_DEBUG !== '1');
if (profile.lobbyData) mock.setUserdata(Buffer.from(profile.lobbyData, 'base64'));
mock.updateNickname(profile.nickname);
mock.updateRanks(profile.ranks);
mock.updateProfileStats(profile.stats);

let saveTimer = null;
let saveChain = Promise.resolve();
function persistSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    profile.lobbyData = Buffer.from(mock.userdata.serialize()).toString('base64');
    saveChain = saveChain.then(() => saveProfile(userdataDirectory, profile))
      .catch((error) => console.error('[local] 存档失败:', error));
  }, 50);
}

const session = mock.createSession();
session.localProfile = profile;
session.onNicknameChange = (nickname) => {
  profile.nickname = nickname;
  persistSoon();
};
session.internalState = { ...profile.settings.internalState };
session.onSettingsChange = (state) => {
  profile.settings.internalState = { ...state };
  persistSoon();
};
session.onFinalResult = (scores, engine) => {
  const result = recordMatch(profile, {
    players: engine.playersN,
    matchLength: engine.matchLength,
    scores,
    matchStats: engine.matchStats,
  });
  mock.updateRanks(profile.ranks);
  mock.updateProfileStats(profile.stats);
  console.log(`[local] 对局结束：${engine.playersN}麻 ${engine.matchLength}，第${result.placement}名，段位 PT ${result.rank.change >= 0 ? '+' : ''}${result.rank.change}，金币 +${result.coins}`);
  persistSoon();
  return result;
};
session.onMatchFinish = () => persistSoon();

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.mp3', 'audio/mpeg'],
  ['.ogg', 'audio/ogg'],
  ['.bundle', 'application/octet-stream'],
  ['.unityweb', 'application/octet-stream'],
]);

function localPath(url) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(url, 'http://127.0.0.1').pathname); }
  catch { return null; }
  if (pathname === '/') pathname = '/index.html';
  const candidate = path.resolve(root, `.${pathname}`);
  return candidate === root || candidate.startsWith(`${root}${path.sep}`) ? candidate : null;
}

async function sendStatic(request, response) {
  const file = localPath(request.url);
  if (!file) {
    response.writeHead(400).end('Bad request');
    return;
  }
  let stat;
  try { stat = await fsp.stat(file); }
  catch {
    response.writeHead(404).end('Not found');
    return;
  }
  if (!stat.isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }

  const extension = path.extname(file).toLowerCase();
  const headers = {
    'Content-Type': MIME.get(extension) || 'application/octet-stream',
    'Cache-Control': extension === '.html' || extension === '.js' ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  };
  if (extension === '.unityweb' && file.includes(`${path.sep}Build${path.sep}`)) headers['Content-Encoding'] = 'br';

  const range = request.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
  if (range) {
    const suffixLength = !range[1] && range[2] ? Number(range[2]) : null;
    const start = suffixLength != null ? Math.max(0, stat.size - suffixLength) : Number(range[1] || 0);
    const end = suffixLength != null ? stat.size - 1 : range[2] ? Number(range[2]) : stat.size - 1;
    if ((!range[1] && !range[2]) || suffixLength === 0 || start > end || start >= stat.size || end >= stat.size) {
      response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end();
      return;
    }
    response.writeHead(206, {
      ...headers,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Content-Length': end - start + 1,
    });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(file, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, { ...headers, 'Content-Length': stat.size });
  if (request.method === 'HEAD') response.end();
  else fs.createReadStream(file).pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  void sendStatic(request, response).catch((error) => {
    console.error('[local] 静态文件错误:', error);
    if (!response.headersSent) response.writeHead(500);
    response.end();
  });
});

const websocketServer = new WebSocketServer({ noServer: true, maxPayload: 2 * 1024 * 1024 });
let activeSocket = null;

function applyGameOptions(requestUrl) {
  const url = new URL(requestUrl, 'http://127.0.0.1');
  const config = mock.config;
  config.playersExplicit = url.searchParams.has('mjPlayers');
  if (config.playersExplicit) {
    config.players = Number(url.searchParams.get('mjPlayers')) === 3 ? 3 : 4;
  }
  config.matchLengthExplicit = url.searchParams.has('mjLength');
  if (config.matchLengthExplicit) {
    config.matchLength = url.searchParams.get('mjLength') === 'hanchan' ? 'hanchan' : 'east';
  }
  if (url.searchParams.has('mjSeed')) config.seed = Number(url.searchParams.get('mjSeed'));
  if (url.searchParams.has('mjSpeed')) config.speed = Number(url.searchParams.get('mjSpeed'));
}

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (url.pathname !== '/ws') {
    socket.destroy();
    return;
  }
  if (activeSocket?.readyState === WebSocket.OPEN) {
    socket.write('HTTP/1.1 409 Conflict\r\nConnection: close\r\n\r\n');
    socket.destroy();
    return;
  }
  applyGameOptions(request.url);
  websocketServer.handleUpgrade(request, socket, head, (websocket) => websocketServer.emit('connection', websocket, request));
});

websocketServer.on('connection', (websocket) => {
  activeSocket = websocket;
  const connectedAt = Date.now();
  const recentRequests = [];
  let serverClose = null;
  const adapter = {
    readyState: 1,
    _deliver(bytes) {
      if (websocket.readyState === WebSocket.OPEN) websocket.send(bytes, { binary: true });
    },
    close(code, reason) {
      serverClose = { code, reason: String(reason || '') };
      websocket.close(code, reason);
    },
  };
  session.resume(adapter);
  if (session.riichi?.engine) {
    session.riichi.engine.speed = mock.config.speed;
    session.riichi.engine.setHumanAutoplay(false);
  }
  console.log('[local] 游戏页面已连接');

  websocket.on('message', (data, isBinary) => {
    if (!isBinary) return;
    // 仅保留消息编号，不记录昵称、存档、手牌或完整报文。
    try {
      recentRequests.push(Number(globalThis.__mj.proto.dict(new Uint8Array(data))[2]) || 0);
      if (recentRequests.length > 12) recentRequests.shift();
    } catch { /* 诊断解析失败不能改变原分发行为 */ }
    const frames = mock.dispatch(session, new Uint8Array(data));
    for (const frame of frames) adapter._deliver(frame);
    persistSoon();
  });
  websocket.on('close', (code, reason) => {
    console.log('[local] WebSocket 关闭：' + JSON.stringify({
      time: new Date().toISOString(), code, reason: reason.toString(),
      source: serverClose ? 'server' : 'peer-or-transport', serverClose,
      connectedMs: Date.now() - connectedAt, recentRequests,
      inMatch: !!session.riichi?.engine && !session.riichi.matchOver,
    }));
    if (activeSocket === websocket) activeSocket = null;
    adapter.readyState = 3;
    if (!session.riichi && (session.matchTimer || session.engineStartTimer)) {
      if (session.matchTimer) clearTimeout(session.matchTimer);
      if (session.engineStartTimer) clearTimeout(session.engineStartTimer);
      session.matchTimer = null;
      session.engineStartTimer = null;
      session.matchToken += 1;
      session.tableId = 0;
      session.seat = -1;
      session.table = null;
    }
    session.suspend();
    if (session.riichi?.engine && !session.riichi.matchOver) {
      session.riichi.engine.speed = 0;
      session.riichi.engine.setHumanAutoplay(true);
      console.log('[local] 页面断开，AI 已接管真人席并快速完成当前比赛');
    } else {
      console.log('[local] 游戏页面已断开');
    }
    persistSoon();
  });
  websocket.on('error', (error) => console.warn('[local] WebSocket:', error.message));
});

const host = '127.0.0.1';
const port = Number(process.env.MJ_PORT || 8765);
server.once('error', (error) => {
  const detail = error.code === 'EADDRINUSE'
    ? `端口 ${port} 已被占用，请关闭旧的游戏服务或设置其他 MJ_PORT。`
    : `本地服务启动失败：${error.message}`;
  console.error(`[local] ${detail}`);
  if (process.send) process.send({ type: 'startup-error', detail });
  process.exitCode = 1;
});
server.listen(port, host, () => {
  const actualPort = server.address().port;
  const url = `http://${host}:${actualPort}/`;
  console.log(`[local] 激情麻将已启动：${url}`);
  if (process.send) process.send({ type: 'ready', url });
});

async function shutdown() {
  clearTimeout(saveTimer);
  await saveChain;
  profile.lobbyData = Buffer.from(mock.userdata.serialize()).toString('base64');
  await saveProfile(userdataDirectory, profile).catch((error) => console.error('[local] 存档失败:', error));
  server.close();
  websocketServer.close();
}

process.once('SIGINT', () => void shutdown().finally(() => process.exit(0)));
process.once('SIGTERM', () => void shutdown().finally(() => process.exit(0)));
