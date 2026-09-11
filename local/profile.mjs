import fs from 'node:fs/promises';
import path from 'node:path';
import { ECONOMY_CATALOG as C } from '../mockjs/economy_catalog.mjs';
import { setTimeout as delay } from 'node:timers/promises';

export const PROFILE_VERSION = 1;

const RANK_NAMES = ['新人', 'D3', 'D2', 'D1', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1', '初段', '二段', '三段', '四段', '五段', '六段', '七段', '八段', '九段', '十段', '雀梦之巅', '雀梦之巅'];

export function applyRankResult(profile, { players, matchLength, placement, roomId = null }) {
  const key = players === 3 ? 'sanma' : 'yonma';
  const table = C[`${key}Ranks`];
  const rank = profile.ranks[key];
  const oldLevel = Math.min(table.length, Math.max(1, Math.trunc(Number(rank.level)) || 1));
  const oldPoint = Math.max(0, Number(rank.point) || 0);
  const rule = table[oldLevel - 1];
  const pointRule = C.rankPoints.find((row) => row.rank === oldLevel && row.room === roomId)
    || C.rankPoints.find((row) => row.rank === oldLevel && row.room === rule.room);
  const prefix = matchLength === 'hanchan' ? 'half' : 'east';
  const change = pointRule?.[`${prefix}${placement}_${players}`] || 0;
  let level = oldLevel;
  let point = oldPoint + change;
  if (level < table.length && point >= rule.up) {
    level += 1;
    // 雀梦之巅过渡段继承上一段 PT；普通升段从原表初始 PT 开始。
    point = table[level - 1].inherit ? point : table[level - 1].initial;
  } else if (level > 1 && rule.canDecrease && point < 0) {
    level -= 1;
    point = table[level - 1].down || table[level - 1].initial;
  } else {
    point = Math.max(0, point);
  }
  rank.level = level;
  rank.point = point;
  return { oldLevel, oldPoint, level, point, change, name: RANK_NAMES[level - 1] };
}

function emptyStatDetail(players) {
  return {
    hands: 0,
    games: 0,
    placements: Array.from({ length: players }, () => 0),
    wins: 0,
    dealIns: 0,
    riichi: 0,
    calls: 0,
    tsumo: 0,
    ron: 0,
    winPoints: 0,
    winTurns: 0,
    busts: 0,
    maxRenchan: 0,
  };
}

function emptyStats(players) {
  return {
    players,
    ...emptyStatDetail(players),
    eastGames: 0,
    hanchanGames: 0,
    byLength: {
      east: emptyStatDetail(players),
      hanchan: emptyStatDetail(players),
    },
  };
}

export function createDefaultProfile() {
  return {
    version: PROFILE_VERSION,
    nickname: '离线玩家',
    coins: 999_999,
    ranks: {
      yonma: { ...C.defaults.rank },
      sanma: { ...C.defaults.rank },
    },
    stats: {
      yonma: emptyStats(4),
      sanma: emptyStats(3),
    },
    settings: {
      internalState: { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false },
    },
    lobbyData: null,
  };
}

function normalizeStats(value, players) {
  const defaults = emptyStats(players);
  const stats = value && typeof value === 'object' ? value : {};
  const normalized = { ...defaults, ...stats };
  normalized.placements = defaults.placements.map((_, index) => Number(stats.placements?.[index]) || 0);
  normalized.byLength = {};
  for (const length of ['east', 'hanchan']) {
    const detail = stats.byLength?.[length];
    normalized.byLength[length] = {
      ...defaults.byLength[length],
      ...detail,
      games: Number(detail?.games ?? stats[`${length}Games`]) || 0,
      placements: defaults.byLength[length].placements.map((_, index) => Number(detail?.placements?.[index]) || 0),
    };
  }
  return normalized;
}


function normalizeProfile(value) {
  const defaults = createDefaultProfile();
  const profile = value && typeof value === 'object' ? value : {};
  return {
    ...defaults,
    ...profile,
    version: PROFILE_VERSION,
    ranks: {
      yonma: { ...defaults.ranks.yonma, ...profile.ranks?.yonma },
      sanma: { ...defaults.ranks.sanma, ...profile.ranks?.sanma },
    },
    stats: {
      yonma: normalizeStats(profile.stats?.yonma, 4),
      sanma: normalizeStats(profile.stats?.sanma, 3),
    },
    settings: {
      ...defaults.settings,
      ...profile.settings,
      internalState: { ...defaults.settings.internalState, ...profile.settings?.internalState },
    },
  };
}

export async function loadProfile(directory) {
  await fs.mkdir(directory, { recursive: true });
  const file = path.join(directory, 'profile.json');
  try {
    return normalizeProfile(JSON.parse(await fs.readFile(file, 'utf8')));
  } catch (error) {
    if (error.code === 'ENOENT') return createDefaultProfile();
    if (!(error instanceof SyntaxError)) throw error;
    const backup = path.join(directory, `profile.corrupt-${Date.now()}.json`);
    await fs.rename(file, backup).catch(() => {});
    console.warn(`[local] 存档损坏，已保留为 ${backup} 并创建新档案`);
    return createDefaultProfile();
  }
}

export async function saveProfile(directory, profile) {
  const body = `${JSON.stringify(normalizeProfile(profile), null, 2)}\n`;
  await fs.mkdir(directory, { recursive: true });
  const file = path.join(directory, 'profile.json');
  const temporary = `${file}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  try {
    await fs.writeFile(temporary, body, 'utf8');
    for (let attempt = 0; ; attempt++) {
      try {
        await fs.rename(temporary, file);
        break;
      } catch (error) {
        // Windows 短暂的读句柄/杀毒扫描可阻止替换；始终保留旧档案，最多尝试三次。
        if (!['EPERM', 'EACCES', 'EBUSY'].includes(error.code) || attempt >= 2) throw error;
        await delay(10 * 2 ** attempt);
      }
    }
  } catch (error) {
    await fs.rm(temporary, { force: true }).catch(() => {});
    throw error;
  }
}

export function sanitizeNickname(value) {
  const nickname = String(value ?? '').trim();
  if (!nickname || /[\u0000-\u001f\u007f]/u.test(nickname)) return null;
  return nickname;
}

function addMatchStats(stats, placement, score, matchStats) {
  stats.games += 1;
  stats.placements[placement - 1] += 1;
  if (score < 0) stats.busts += 1;
  if (!matchStats) return;
  for (const field of ['hands', 'wins', 'dealIns', 'riichi', 'calls', 'tsumo', 'ron', 'winPoints', 'winTurns']) {
    stats[field] += Number(matchStats[field]) || 0;
  }
  stats.maxRenchan = Math.max(stats.maxRenchan, Number(matchStats.maxRenchan) || 0);
}


export function recordMatch(profile, { players, matchLength, scores, matchStats = null, roomId = null }) {
  const key = players === 3 ? 'sanma' : 'yonma';
  const stats = profile.stats[key];
  const order = scores.map((score, seat) => ({ score, seat }))
    .sort((left, right) => right.score - left.score || left.seat - right.seat);
  const placement = order.findIndex((entry) => entry.seat === 0) + 1;
  const length = matchLength === 'hanchan' ? 'hanchan' : 'east';
  stats[`${length}Games`] += 1;
  addMatchStats(stats, placement, scores[0], matchStats);
  addMatchStats(stats.byLength[length], placement, scores[0], matchStats);
  const rank = applyRankResult(profile, { players, matchLength, placement, roomId });
  profile.coins += 100;
  return { placement, coins: 100, rank };
}
