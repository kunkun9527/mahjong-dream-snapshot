import { SICHUAN_CATALOG } from './sichuan_catalog.mjs';
import { analyzeSichuanHand, sichuanKind, sichuanWaitKinds } from './sichuan_hand.mjs';
import { tileId } from './tiles.mjs';

const catalogs = new Map([5021, 5022].map((gameType) => [gameType,
  new Map(SICHUAN_CATALOG.games[gameType].yaku.map((item) => [item.calcYiType, item]))]));

function checkRules(gameType, topBei) {
  if (!catalogs.has(gameType)) throw new RangeError('此计分器仅支持普通血战/血流，不支持红中赖子');
  // 单次和牌按房间封顶（两种玩法原表均为128/256）；血流整局累计上限由局序执行。
  if (![128, 256].includes(topBei)) throw new RangeError('必须由房间规则明确指定合法封顶倍数');
}

function yaku(gameType, calcYiType) {
  const rule = catalogs.get(gameType).get(calcYiType);
  if (!rule || rule.beiType !== 2) throw new Error(`未核验的四川番型 ${calcYiType}`);
  return { yiType: rule.yiType, name: rule.name, bei: rule.bei };
}

const terminal = (kind) => kind % 9 === 0 || kind % 9 === 8;

// 复合牌型替代已包含的组成项；不执行原表中有自引用/跨玩法引用的ExceptYis。
// 未写清的组成项扣除约定见docs/adr/0004-sichuan-scoring-clarifications.md。
function shapeYaku(shape, melds, kinds, rootCount) {
  const pure = new Set(kinds.map((kind) => Math.floor(kind / 9))).size === 1;
  const simple = kinds.every((kind) => !terminal(kind));
  const jiang = kinds.every((kind) => [1, 4, 7].includes(kind % 9));
  const ids = [];
  let includedPure = false;
  let consumedRoots = 0;
  if (shape.type === 'sevenPairs') {
    const dragons = shape.quadKinds.length;
    consumedRoots = dragons;
    if (jiang) {
      ids.push(dragons === 3 ? 3010 : dragons === 2 ? 3009 : 3005);
    } else if (pure && dragons <= 1) {
      ids.push(dragons ? 3007 : 3004);
      includedPure = true;
    } else {
      ids.push([3001, 3003, 3006, 3008][dragons]);
    }
  } else {
    const triplets = shape.groups.every((group) => group.type !== 'sequence');
    const singleWait = melds.length === 4;
    const fourKongs = singleWait && shape.groups.every((group) => group.type === 'quad');
    if (fourKongs) {
      ids.push(pure ? 1009 : 1008);
      includedPure = pure;
      consumedRoots = 4;
      if (jiang) ids.push(1006);
    } else if (singleWait) {
      ids.push(pure ? 1007 : 1004);
      includedPure = pure;
      if (jiang) ids.push(1006);
    } else if (triplets) {
      ids.push(pure ? 1005 : jiang ? 1006 : 1003);
      includedPure = pure;
    }
    if (terminal(shape.pair) && shape.groups.every((group) => group.type === 'sequence'
      ? group.kind % 9 === 0 || group.kind % 9 === 6 : terminal(group.kind))) ids.push(14);
  }
  if (pure && !includedPure) ids.push(13);
  if (simple && !jiang) ids.push(12);
  if (!ids.length) ids.push(1001);
  const countedRoots = rootCount - consumedRoots;
  if (countedRoots > 0) ids.push(6 + countedRoots);
  return { ids, countedRoots };
}

// hand包含本次和牌的实体牌。winType及开局/杠/海底标记必须由权威局序提供。
export function scoreSichuanHand(hand, {
  melds = [], missingSuit, gameType = 5022, topBei,
  winType = 'ron', afterKong = false, lastTile = false, opening = null,
} = {}) {
  checkRules(gameType, topBei);
  if (!['ron', 'tsumo', 'robKong'].includes(winType) || ![null, 'heaven', 'earth'].includes(opening)
      || typeof afterKong !== 'boolean' || typeof lastTile !== 'boolean') throw new RangeError('无效的四川和牌情境');
  if ((afterKong || lastTile || opening) && winType !== 'tsumo') throw new RangeError('自摸情境不能用于荣和或抢杠');
  if (opening && (afterKong || lastTile || melds.length)) throw new RangeError('天胡/地胡不能与杠、海底或已有副露混用');
  const shapes = analyzeSichuanHand(hand, { melds, missingSuit });
  if (afterKong && !melds.some((meld) => ['kan', 'ankan'].includes(meld.type))) throw new RangeError('杠上开花必须有实际杠牌');
  if (!shapes.length) return null;
  const kinds = [...hand, ...melds.flatMap((meld) => meld.tiles)].map(sichuanKind);
  const counts = Array(27).fill(0);
  for (const kind of kinds) counts[kind] += 1;
  const rootCount = counts.filter((count) => count === 4).length;
  let best = null;
  for (const shape of shapes) {
    const { ids, countedRoots } = shapeYaku(shape, melds, kinds, rootCount);
    if (opening) ids.push(opening === 'heaven' ? 1 : 2);
    else if (winType === 'tsumo') ids.push(4);
    if (afterKong) ids.push(6);
    if (lastTile) ids.push(5);
    if (winType === 'robKong') ids.push(3);
    const items = ids.map((id) => yaku(gameType, id));
    if (countedRoots) {
      const item = items.find((entry) => entry.yiType === yaku(gameType, 6 + countedRoots).yiType);
      item.name = countedRoots === 1 ? '根' : `${countedRoots}根`;
    }
    const rawBei = items.reduce((total, item) => total * item.bei, 1);
    if (!Number.isSafeInteger(rawBei)) throw new RangeError('四川倍数溢出');
    const result = { gameType, winType, rawBei, bei: Math.min(rawBei, topBei), capped: rawBei > topBei,
      rootCount, countedRoots, yaku: items, shape };
    // 先比较未封顶倍数；封顶相同也保留真正最优牌形，平手保持分解器稳定顺序。
    if (!best || rawBei > best.rawBei) best = result;
  }
  return best;
}

// 查大叫只能用牌形本身的最大荣和倍数，不能假设未来自摸/抢杠/天胡等机会役。
export function maxSichuanReadyScore(hand, { melds = [], missingSuit, gameType = 5022, topBei } = {}) {
  checkRules(gameType, topBei);
  const waits = sichuanWaitKinds(hand, { melds, missingSuit });
  const used = new Set([...hand, ...melds.flatMap((meld) => meld.tiles)]);
  let best = null;
  for (const kind of waits) {
    let copy = 1;
    const suit = Math.floor(kind / 9) + 1;
    const rank = kind % 9 + 1;
    while (used.has(tileId(suit, rank, copy))) copy += 1;
    const score = scoreSichuanHand([...hand, tileId(suit, rank, copy)], { melds, missingSuit, gameType, topBei });
    if (score && (!best || score.rawBei > best.rawBei)) best = { ...score, waitKind: kind };
  }
  return best;
}

function seatsAndBase(activeSeats, seat, baseScore) {
  if (!Array.isArray(activeSeats) || activeSeats.length < 2 || activeSeats.length > 4
      || new Set(activeSeats).size !== activeSeats.length || !activeSeats.includes(seat)
      || ![...activeSeats].every((value) => Number.isInteger(value) && value >= 0 && value < 4)) throw new RangeError('无效的在局座位');
  if (!Number.isSafeInteger(baseScore) || baseScore <= 0) throw new RangeError('底分必须为安全正整数');
}

function payments(payers, receiver, units, baseScore) {
  const amount = units * baseScore;
  if (!Number.isSafeInteger(amount) || !Number.isSafeInteger(amount * payers.length)) throw new RangeError('支付金额溢出');
  const delta = [0, 0, 0, 0];
  const transfers = payers.map((from) => ({ from, to: receiver, amount }));
  for (const transfer of transfers) {
    delta[transfer.from] -= transfer.amount;
    delta[transfer.to] += transfer.amount;
  }
  return { delta, transfers };
}

// 仅计算积分转移，不读写钱包；庄家不额外加倍，已胡退出者不再参与付款。
export function sichuanWinPayments({ winner, loser = null, activeSeats, bei, baseScore }) {
  seatsAndBase(activeSeats, winner, baseScore);
  if (!Number.isSafeInteger(bei) || bei <= 0) throw new RangeError('和牌倍数必须为安全正整数');
  if (loser !== null && (!activeSeats.includes(loser) || loser === winner)) throw new RangeError('无效的放铳座位');
  return payments(loser === null ? activeSeats.filter((seat) => seat !== winner) : [loser], winner, bei, baseScore);
}

export function sichuanKongPayments({ seat, kind, from = null, activeSeats, baseScore, waived = false }) {
  seatsAndBase(activeSeats, seat, baseScore);
  if (!['exposed', 'added', 'concealed'].includes(kind) || typeof waived !== 'boolean') throw new RangeError('无效的杠类型');
  if (waived && kind !== 'added') throw new RangeError('先碰后补免杠费只能用于补杠');
  if (kind === 'exposed' ? !activeSeats.includes(from) || from === seat : from !== null) throw new RangeError('无效的放杠座位');
  if (waived) return { delta: [0, 0, 0, 0], transfers: [] };
  return payments(kind === 'exposed' ? [from] : activeSeats.filter((value) => value !== seat),
    seat, kind === 'added' ? 1 : 2, baseScore);
}
