import { analyzeSichuanHand, sichuanKind } from './sichuan_hand.mjs';
import { maxSichuanReadyScore } from './sichuan_score.mjs';

// 只接收权威局序记录；不读钱包。已胡者保留既有所得，不参加查叫/退税。
// 花猪不叠加查叫；全程打缺免花猪费但不免退税。补充约定见ADR 0004。
export function settleSichuanDraw(players, kongs, { topBei, baseScore }) {
  if (!Array.isArray(players) || players.length !== 4 || !Array.isArray(kongs)
      || ![128, 256].includes(topBei) || !Number.isSafeInteger(baseScore) || baseScore <= 0) {
    throw new RangeError('无效的血战荒牌清算参数');
  }
  const used = new Set();
  const status = Array.from(players, (player) => {
    if (!player || typeof player.won !== 'boolean' || typeof player.allDiscardsMissing !== 'boolean'
        || !Number.isSafeInteger(player.discardCount) || player.discardCount < 0) throw new RangeError('无效的玩家清算记录');
    analyzeSichuanHand(player.hand, player);
    for (const tile of [...player.hand, ...player.melds.flatMap((meld) => meld.tiles)]) {
      if (used.has(tile)) throw new RangeError('玩家之间重复实体牌');
      used.add(tile);
    }
    if (player.won) return { type: 'won', bei: 0 };
    if (player.hand.length !== 13 - 3 * player.melds.length) throw new RangeError('荒牌时手牌张数不符');
    const flower = player.hand.some((tile) => Math.floor(sichuanKind(tile) / 9) + 1 === player.missingSuit);
    if (flower) return { type: 'flower', bei: 0, exempt: player.discardCount > 0 && player.allDiscardsMissing };
    const score = maxSichuanReadyScore(player.hand, { ...player, topBei });
    return { type: score ? 'ready' : 'notReady', bei: score?.bei ?? 0 };
  });
  const delta = [0, 0, 0, 0];
  const transfers = [];
  const add = (from, to, amount, reason, kongIndex = null) => {
    if (![from, to].every((seat) => Number.isInteger(seat) && seat >= 0 && seat < 4) || from === to
        || !Number.isSafeInteger(amount) || amount <= 0) throw new RangeError('无效的清算转账');
    if (!Number.isSafeInteger(delta[from] - amount) || !Number.isSafeInteger(delta[to] + amount)) throw new RangeError('清算溢出');
    delta[from] -= amount;
    delta[to] += amount;
    transfers.push({ from, to, amount, reason, kongIndex });
  };
  for (const [index, kong] of kongs.entries()) {
    if (!kong || !Number.isInteger(kong.seat) || !status[kong.seat] || typeof kong.transferred !== 'boolean'
        || !Array.isArray(kong.transfers)) throw new RangeError('无效的杠费记录');
    const payers = new Set();
    for (const transfer of kong.transfers) {
      if (!transfer || transfer.to !== kong.seat || !Number.isInteger(transfer.from) || !status[transfer.from]
          || transfer.from === kong.seat || payers.has(transfer.from)
          || !Number.isSafeInteger(transfer.amount) || transfer.amount <= 0) throw new RangeError('无效的原始杠费');
      payers.add(transfer.from);
      if (!kong.transferred && ['notReady', 'flower'].includes(status[kong.seat].type)) {
        add(kong.seat, transfer.from, transfer.amount, 'refund', index);
      }
    }
  }
  for (let from = 0; from < 4; from += 1) {
    for (let to = 0; to < 4; to += 1) {
      if (from === to) continue;
      if (status[from].type === 'flower' && !status[from].exempt && status[to].type !== 'flower') {
        add(from, to, 16 * baseScore, 'flower');
      } else if (status[from].type === 'notReady' && status[to].type === 'ready') {
        add(from, to, status[to].bei * baseScore, 'ready');
      }
    }
  }
  return { status, delta, transfers };
}
