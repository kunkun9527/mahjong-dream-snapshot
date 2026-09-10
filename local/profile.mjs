import fs from 'node:fs/promises';
import path from 'node:path';

export const PROFILE_VERSION = 1;

const RANK_NAMES = ['新人', '９级', '８级', '７级', '６级', '５级', '４级', '３级', '２级', '１级', '初段', '二段', '三段', '四段', '五段', '六段', '七段', '八段', '九段', '十段', '最高段'];
const RANK_MIN = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 400, 600, 800, 1_000, 1_200, 1_400, 1_600, 1_800, 2_000, 2_200];
const RANK_UP = [20, 20, 20, 20, 40, 60, 80, 100, 100, 100, 400, 800, 1_200, 1_600, 2_000, 2_400, 2_800, 3_200, 3_600, 4_000, 0];

function rankDelta(players, matchLength, level, placement) {
  const half = matchLength === 'hanchan';
  let values;
  if (players === 3) {
    if (level <= 8) values = half ? [45, 0, 0] : [30, 0, 0];
    else if (level <= 10) values = half ? [45, 0, -15 * (level - 8)] : [30, 0, -10 * (level - 8)];
    else if (level === 21) values = half ? [8, 0, -8] : [5, 0, -5];
    else {
      const first = level <= 13 ? 50 : level <= 16 ? 70 : 90;
      const last = -(level - 8) * 10;
      values = half ? [Math.round(first * 1.5), 0, Math.round(last * 1.5)] : [first, 0, last];
    }
  } else {
    if (level <= 8) values = half ? [30, 15, 0, 0] : [20, 10, 0, 0];
    else if (level <= 10) values = half ? [30, 15, 0, -15 * (level - 8)] : [20, 10, 0, -10 * (level - 8)];
    else if (level === 21) values = half ? [9, 0, -3, -9] : [6, 0, -2, -6];
    else {
      const first = level <= 13 ? 40 : level <= 16 ? 50 : 60;
      const second = level <= 13 ? 10 : level <= 16 ? 20 : 30;
      const last = -(level - 8) * 10;
      values = half ? [Math.round(first * 1.5), Math.round(second * 1.5), 0, Math.round(last * 1.5)] : [first, second, 0, last];
    }
  }
  return values[placement - 1] || 0;
}

export function applyRankResult(profile, { players, matchLength, placement }) {
  const key = players === 3 ? 'sanma' : 'yonma';
  const rank = profile.ranks[key];
  const oldLevel = Math.min(21, Math.max(1, Number(rank.level) || 1));
  const oldPoint = Math.max(RANK_MIN[oldLevel - 1], Number(rank.point) || 0);
  const change = rankDelta(players, matchLength, oldLevel, placement);
  let level = oldLevel;
  let point = oldPoint + change;
  if (RANK_UP[level - 1] && point >= RANK_UP[level - 1]) {
    level += 1;
    point = RANK_MIN[level - 1];
  } else if (level >= 12 && level <= 20 && point < RANK_MIN[level - 1]) {
    level -= 1;
    point = Math.max(RANK_MIN[level - 1], RANK_UP[level - 1] - 1);
  } else {
    point = Math.max(RANK_MIN[level - 1], point);
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
    coins: 0,
    ranks: {
      yonma: { level: 1, point: 0 },
      sanma: { level: 1, point: 0 },
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
    await fs.rename(temporary, file);
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


export function recordMatch(profile, { players, matchLength, scores, matchStats = null }) {
  const key = players === 3 ? 'sanma' : 'yonma';
  const stats = profile.stats[key];
  const order = scores.map((score, seat) => ({ score, seat }))
    .sort((left, right) => right.score - left.score || left.seat - right.seat);
  const placement = order.findIndex((entry) => entry.seat === 0) + 1;
  const length = matchLength === 'hanchan' ? 'hanchan' : 'east';
  stats[`${length}Games`] += 1;
  addMatchStats(stats, placement, scores[0], matchStats);
  addMatchStats(stats.byLength[length], placement, scores[0], matchStats);
  const rank = applyRankResult(profile, { players, matchLength, placement });
  profile.coins += 100;
  return { placement, coins: 100, rank };
}
