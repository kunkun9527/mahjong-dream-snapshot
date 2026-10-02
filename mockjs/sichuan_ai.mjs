import { standardShantenOfCounts } from './shanten.mjs';
import { analyzeSichuanHand, legalSichuanDiscards, sichuanKind, sichuanWaitKinds } from './sichuan_hand.mjs';
import { tileId } from './tiles.mjs';

function countsOf(hand, missingSuit = 0) {
  const counts = Array(34).fill(0);
  for (const id of hand) {
    const kind = sichuanKind(id);
    if (Math.floor(kind / 9) + 1 !== missingSuit) counts[kind] += 1;
  }
  return counts;
}

function estimate(counts, meldCount) {
  const usable = counts.reduce((sum, count) => sum + count, 0);
  // 通用标准向听默认有完整的13/14张手牌；剔除待打缺牌后还须约束可保留的张数。
  let result = Math.max(standardShantenOfCounts(counts, meldCount), 13 - 3 * meldCount - usable);
  if (!meldCount) {
    const pairs = counts.reduce((sum, count) => sum + Math.floor(count / 2), 0);
    const singles = counts.filter((count) => count % 2 === 1).length;
    // 四张当两个对子；不能复用日麻七对或国士向听。
    result = Math.min(result, 13 - 2 * pairs - Math.min(7 - pairs, singles));
  }
  return result;
}

function checkHolding(hand, melds, missingSuit) {
  analyzeSichuanHand(hand, { melds, missingSuit });
  if (![13 - 3 * melds.length, 14 - 3 * melds.length].includes(hand.length)) throw new RangeError('AI手牌张数与面子数不符');
  if (melds.some((meld) => meld.tiles.some((id) => Math.floor(sichuanKind(id) / 9) + 1 === missingSuit))) {
    throw new RangeError('AI副露不能含定缺花色');
  }
}

// AI排序估计，不作为合法和牌/听牌的权威判断。零向听须通过实体牌等待复核。
export function sichuanShanten(hand, { melds = [], missingSuit } = {}) {
  checkHolding(hand, melds, missingSuit);
  const shanten = estimate(countsOf(hand, missingSuit), melds.length);
  if (shanten === 0) {
    const candidates = hand.length === 13 - 3 * melds.length ? [hand]
      : [...new Map(legalSichuanDiscards(hand, missingSuit).map((id) => [sichuanKind(id), id])).values()]
        .map((id) => hand.filter((tile) => tile !== id));
    if (!candidates.some((tiles) => sichuanWaitKinds(tiles, { melds, missingSuit }).length)) return 1;
  }
  return shanten;
}

function checkInitialHand(hand) {
  legalSichuanDiscards(hand, 1);
  if (![13, 14].includes(hand.length)) throw new RangeError('换牌/定缺需要完整起手牌');
}

export function chooseSichuanMissingSuit(hand) {
  checkInitialHand(hand);
  const suits = [1, 2, 3].map((suit) => ({ suit,
    count: hand.filter((id) => Math.floor(sichuanKind(id) / 9) + 1 === suit).length,
    shanten: estimate(countsOf(hand, suit), 0) }));
  suits.sort((a, b) => a.count - b.count || a.shanten - b.shanten || a.suit - b.suit);
  return suits[0].suit;
}

export function chooseSichuanExchange(hand) {
  checkInitialHand(hand);
  const suits = [1, 2, 3].map((suit) => hand.filter((id) => Math.floor(sichuanKind(id) / 9) + 1 === suit).sort((a, b) => a - b))
    .filter((tiles) => tiles.length >= 3);
  const smallest = Math.min(...suits.map((tiles) => tiles.length));
  let best = null;
  for (const tiles of suits.filter((tiles) => tiles.length === smallest)) {
    for (let a = 0; a < tiles.length - 2; a += 1) {
      for (let b = a + 1; b < tiles.length - 1; b += 1) {
        for (let c = b + 1; c < tiles.length; c += 1) {
          const selected = [tiles[a], tiles[b], tiles[c]];
          const retained = hand.filter((id) => !selected.includes(id));
          const shanten = estimate(countsOf(retained), 0);
          if (!best || shanten < best.shanten) best = { tiles: selected, shanten };
        }
      }
    }
  }
  return best.tiles;
}

// visibleTiles只包含手牌/本人副露之外的已公开实体；调用方去除牌河、鸣牌等展示别名。
function knownTiles(hand, melds, visibleTiles) {
  if (!Array.isArray(visibleTiles) || visibleTiles.length > 108) throw new RangeError('无效的公开实体牌列表');
  const seen = new Set();
  const counts = Array(27).fill(0);
  for (const id of [...hand, ...melds.flatMap((meld) => meld.tiles), ...visibleTiles]) {
    const kind = sichuanKind(id);
    if (seen.has(id)) throw new RangeError('AI可见信息中出现重复实体牌');
    seen.add(id);
    counts[kind] += 1;
  }
  return { seen, counts };
}

function improvements(hand, melds, missingSuit, shanten, known) {
  const waits = [];
  let ukeire = 0;
  for (let kind = 0; kind < 27; kind += 1) {
    if (Math.floor(kind / 9) + 1 === missingSuit || known.counts[kind] === 4) continue;
    const suit = Math.floor(kind / 9) + 1;
    const rank = kind % 9 + 1;
    let copy = 1;
    while (known.seen.has(tileId(suit, rank, copy))) copy += 1;
    const drawn = [...hand, tileId(suit, rank, copy)];
    const improves = shanten === 0 ? analyzeSichuanHand(drawn, { melds, missingSuit }).length > 0
      : sichuanShanten(drawn, { melds, missingSuit }) < shanten;
    if (improves) {
      waits.push(kind);
      ukeire += 4 - known.counts[kind];
    }
  }
  return { waits, ukeire };
}

// 只读取这四个视图字段，不接受权威引擎对象、对手暗牌、未来牌山等决策输入。
export function chooseSichuanDiscard({ hand, melds = [], missingSuit, visibleTiles = [] }) {
  checkHolding(hand, melds, missingSuit);
  if (hand.length !== 14 - 3 * melds.length) throw new RangeError('当前不是可出牌张数');
  const known = knownTiles(hand, melds, visibleTiles);
  const legal = legalSichuanDiscards(hand, missingSuit).sort((a, b) => a - b);
  const byKind = new Map();
  for (const tile of legal) if (!byKind.has(sichuanKind(tile))) byKind.set(sichuanKind(tile), tile);
  const choices = [...byKind.values()].map((tile) => {
    const remaining = hand.filter((id) => id !== tile);
    return { tile, remaining, shanten: sichuanShanten(remaining, { melds, missingSuit }) };
  });
  const bestShanten = Math.min(...choices.map((choice) => choice.shanten));
  let best = null;
  for (const choice of choices.filter((entry) => entry.shanten === bestShanten)) {
    const { waits, ukeire } = improvements(choice.remaining, melds, missingSuit, choice.shanten, known);
    if (!best || ukeire > best.ukeire) best = { tile: choice.tile, shanten: choice.shanten, waits, ukeire };
  }
  return best;
}

// flags来自权威动作窗口（包含过胡/余牌等局序限制）；AI仍核对自己的实体牌。
// 返回tiles只含需从本人暗手拿出的牌，叫牌tile另由动作窗口提供。
export function chooseSichuanClaim({ hand, melds = [], missingSuit, visibleTiles = [] },
  { tile, canHu = false, canPon = false, canKong = false }) {
  checkHolding(hand, melds, missingSuit);
  if (hand.length !== 13 - 3 * melds.length) throw new RangeError('当前不是可响应叫牌的张数');
  if (![canHu, canPon, canKong].every((value) => typeof value === 'boolean')) throw new RangeError('无效的权威动作选项');
  const kind = sichuanKind(tile);
  if (hand.includes(tile) || melds.some((meld) => meld.tiles.includes(tile))) throw new RangeError('叫牌不能已在本人手中');
  const publicTiles = visibleTiles.includes(tile) ? visibleTiles : [...visibleTiles, tile];
  knownTiles(hand, melds, publicTiles);
  if (canHu) {
    if (!analyzeSichuanHand([...hand, tile], { melds, missingSuit }).length) throw new RangeError('胡牌选项与实体手牌不符');
    return { type: 'hu', tiles: [] };
  }
  const matching = hand.filter((id) => sichuanKind(id) === kind).sort((a, b) => a - b);
  if ((canPon || canKong) && Math.floor(kind / 9) + 1 === missingSuit) throw new RangeError('不能碰杠定缺花色');
  if ((canPon && matching.length < 2) || (canKong && matching.length !== 3)) throw new RangeError('碰杠选项与实体手牌不符');
  const before = sichuanShanten(hand, { melds, missingSuit });
  if (canKong) {
    const nextMelds = [...melds, { type: 'kan', tiles: [...matching, tile] }];
    if (sichuanShanten(hand.filter((id) => !matching.includes(id)), { melds: nextMelds, missingSuit }) <= before) {
      return { type: 'kan', tiles: matching };
    }
  }
  if (canPon) {
    const ownTiles = matching.slice(0, 2);
    const nextMelds = [...melds, { type: 'pon', tiles: [...ownTiles, tile] }];
    const after = chooseSichuanDiscard({ hand: hand.filter((id) => !ownTiles.includes(id)), melds: nextMelds,
      missingSuit, visibleTiles: publicTiles.filter((id) => id !== tile) });
    if (after.shanten < before) return { type: 'pon', tiles: ownTiles };
  }
  return { type: 'pass', tiles: [] };
}
