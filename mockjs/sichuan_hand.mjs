import { decodeId, tileId } from './tiles.mjs';

// 仅普通血战/血流：27种牌各4张。红中血流必须使用单独的赖子规则。
export function buildSichuanWall() {
  const tiles = [];
  for (let suit = 1; suit <= 3; suit += 1) {
    for (let rank = 1; rank <= 9; rank += 1) {
      for (let copy = 1; copy <= 4; copy += 1) tiles.push(tileId(suit, rank, copy));
    }
  }
  return tiles;
}

export function sichuanKind(id) {
  if (!Number.isSafeInteger(id)) throw new RangeError('四川实体牌 ID 必须是整数');
  const { suit, rank, copy } = decodeId(id);
  if (suit < 1 || suit > 3 || rank < 1 || rank > 9 || copy < 1 || copy > 4) {
    throw new RangeError(`无效的普通四川实体牌：${id}`);
  }
  return (suit - 1) * 9 + rank - 1;
}

function inspectHolding(hand, melds, missingSuit) {
  if (![1, 2, 3].includes(missingSuit)) throw new RangeError('必须明确指定万/筒/条中的定缺花色');
  if (!Array.isArray(hand) || !Array.isArray(melds) || melds.length > 4 || hand.length > 14) {
    throw new RangeError('四川手牌或副露结构无效');
  }
  const used = new Set();
  const counts = Array(27).fill(0);
  const allCounts = Array(27).fill(0);
  let hasMissing = false;
  function add(id) {
    const kind = sichuanKind(id);
    if (used.has(id)) throw new RangeError(`重复实体牌：${id}`);
    used.add(id);
    allCounts[kind] += 1;
    if (Math.floor(kind / 9) + 1 === missingSuit) hasMissing = true;
    return kind;
  }
  for (const id of hand) counts[add(id)] += 1;
  const fixedGroups = [];
  for (const meld of melds) {
    const length = meld?.type === 'pon' ? 3 : ['kan', 'ankan'].includes(meld?.type) ? 4 : 0;
    if (!length || !Array.isArray(meld.tiles) || meld.tiles.length !== length) {
      throw new RangeError('四川仅支持三张碰或四张杠，不能吃');
    }
    const kinds = [];
    for (const id of meld.tiles) kinds.push(add(id));
    if (!kinds.every((kind) => kind === kinds[0])) throw new RangeError('碰杠必须是同一种牌');
    fixedGroups.push({ type: length === 4 ? 'quad' : 'triplet', kind: kinds[0], open: meld.type !== 'ankan' });
  }
  return { counts, allCounts, used, hasMissing, fixedGroups };
}

// 只判断已确认的牌形与定缺条件；不在此判断过胡、抢杠时机或支付倍率。
// 分解中的 kind 为内部0..26牌种索引；输入/动作/牌山始终使用实体牌ID。
export function analyzeSichuanHand(hand, { melds = [], missingSuit } = {}) {
  const { counts, hasMissing, fixedGroups } = inspectHolding(hand, melds, missingSuit);
  if (hasMissing || hand.length !== 14 - 3 * melds.length) return [];
  const shapes = [];
  if (!melds.length && counts.every((count) => count % 2 === 0)) {
    const pairs = [];
    const quadKinds = [];
    for (let kind = 0; kind < counts.length; kind += 1) {
      for (let pair = 0; pair < counts[kind] / 2; pair += 1) pairs.push(kind);
      if (counts[kind] === 4) quadKinds.push(kind);
    }
    // 四川龙七对允许四张相同牌作为两个对子，不能复用日麻七对子判定。
    shapes.push({ type: 'sevenPairs', pairs, quadKinds });
  }
  const groups = [];
  const required = 4 - melds.length;
  function split(pair) {
    const kind = counts.findIndex((count) => count > 0);
    if (kind === -1) {
      if (groups.length === required) {
        shapes.push({ type: 'standard', pair, groups: [...fixedGroups, ...groups].map((group) => ({ ...group })) });
      }
      return;
    }
    if (groups.length >= required) return;
    if (counts[kind] >= 3) {
      counts[kind] -= 3;
      groups.push({ type: 'triplet', kind, open: false });
      split(pair);
      groups.pop();
      counts[kind] += 3;
    }
    if (kind % 9 <= 6 && counts[kind + 1] > 0 && counts[kind + 2] > 0) {
      counts[kind] -= 1;
      counts[kind + 1] -= 1;
      counts[kind + 2] -= 1;
      groups.push({ type: 'sequence', kind, open: false });
      split(pair);
      groups.pop();
      counts[kind] += 1;
      counts[kind + 1] += 1;
      counts[kind + 2] += 1;
    }
  }
  for (let pair = 0; pair < counts.length; pair += 1) {
    if (counts[pair] < 2) continue;
    counts[pair] -= 2;
    split(pair);
    counts[pair] += 2;
  }
  return shapes;
}

export function sichuanWaitKinds(hand, { melds = [], missingSuit } = {}) {
  const { allCounts, used, hasMissing } = inspectHolding(hand, melds, missingSuit);
  if (hasMissing || hand.length !== 13 - 3 * melds.length) return [];
  const waits = [];
  for (let kind = 0; kind < 27; kind += 1) {
    const suit = Math.floor(kind / 9) + 1;
    if (suit === missingSuit || allCounts[kind] >= 4) continue;
    const rank = kind % 9 + 1;
    let copy = 1;
    while (used.has(tileId(suit, rank, copy))) copy += 1;
    const id = tileId(suit, rank, copy);
    if (analyzeSichuanHand([...hand, id], { melds, missingSuit }).length) waits.push(kind);
  }
  return waits;
}

export function legalSichuanDiscards(hand, missingSuit) {
  inspectHolding(hand, [], missingSuit);
  const missing = hand.filter((id) => decodeId(id).suit === missingSuit);
  return missing.length ? missing : hand.slice();
}
