import fs from 'node:fs/promises';
import path from 'node:path';
import { fork, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const child = fork(path.join(directory, 'server.mjs'), {
  stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  env: { ...process.env, MJ_PORT: process.env.MJ_PORT || '0' },
});
let opened = false;

const startupTimer = setTimeout(() => {
  if (opened) return;
  console.error('[local] 本地服务 15 秒内未启动，请检查上方错误、端口和游戏资源。');
  child.kill('SIGTERM');
}, 15_000);
const requestedPlayers = process.argv.find((arg) => arg === '--players=3' || arg === '--players=4')?.slice(-1);
const requestedLength = process.argv.find((arg) => arg === '--length=hanchan' || arg === '--length=east')?.split('=')[1];
const requestedEnglish = process.argv.includes('--lang=en');

function gameUrl(baseUrl) {
  const url = new URL(baseUrl);
  if (requestedPlayers) url.searchParams.set('mjPlayers', requestedPlayers);
  if (requestedLength) url.searchParams.set('mjLength', requestedLength);
  if (requestedEnglish) url.searchParams.set('mjLang', 'en');
  return url.toString();
}
async function firstExisting(paths) {
  for (const candidate of paths) {
    if (!candidate) continue;
    try {
      await fs.access(candidate);
      return candidate;
    } catch { /* try next */ }
  }
  return null;
}

function spawnDetached(command, args) {
  return new Promise((resolve, reject) => {
    const process2 = spawn(command, args, { detached: true, stdio: 'ignore' });
    process2.once('error', reject);
    process2.once('spawn', () => {
      process2.unref();
      resolve();
    });
  });
}

async function openBrowser(url) {
  if (process.platform !== 'win32') {
    await spawnDetached(process.platform === 'darwin' ? 'open' : 'xdg-open', [url]);
    return;
  }
  const edge = await firstExisting([
    process.env['ProgramFiles(x86)'] && path.join(process.env['ProgramFiles(x86)'], 'Microsoft/Edge/Application/msedge.exe'),
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Microsoft/Edge/Application/msedge.exe'),
  ]);
  const chrome = await firstExisting([
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Google/Chrome/Application/chrome.exe'),
    process.env['ProgramFiles(x86)'] && path.join(process.env['ProgramFiles(x86)'], 'Google/Chrome/Application/chrome.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  ]);
  if (edge || chrome) await spawnDetached(edge || chrome, [url]);
  else await spawnDetached('cmd.exe', ['/d', '/s', '/c', 'start', '', url]);
}

child.on('message', (message) => {
  if (message?.type === 'startup-error') {
    clearTimeout(startupTimer);
    console.error(`[local] ${message.detail}`);
    return;
  }
  if (opened || message?.type !== 'ready') return;
  opened = true;
  clearTimeout(startupTimer);
  void openBrowser(gameUrl(message.url)).catch((error) => {
    console.error(`[local] 无法自动打开浏览器：${error.message}`);
    console.error(`[local] 请手动打开：${gameUrl(message.url)}`);
  });
});
child.on('error', (error) => {
  clearTimeout(startupTimer);
  console.error(`[local] 无法启动本地服务进程：${error.message}`);
});
child.on('exit', (code) => {
  clearTimeout(startupTimer);
  if (!opened && code) console.error(`[local] 本地服务已退出（代码 ${code}），请根据上方信息修复后重试。`);
  process.exit(code ?? 0);
});
process.once('SIGINT', () => child.kill('SIGINT'));
process.once('SIGTERM', () => child.kill('SIGTERM'));
