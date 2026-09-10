import Riichi from 'riichi';
import { decodeId, toRiichi } from './tiles.mjs';
import { tileIndex, indexToTileId, countsOf, shantenOfCounts, waitsOfCounts, discardOptionsOfCounts } from './shanten.mjs';

var SUIT_CHAR2 = { 1: "m", 2: "p", 3: "s", 4: "z" };
var kindOf = (id) => {
  const d = decodeId(id);
  return d.suit * 10 + d.rank;
};
var kindOfIndex = (idx) => kindOf(indexToTileId(idx));
function tileDigit(id, akaSet) {
  const { suit, rank } = decodeId(id);
  if (akaSet && akaSet.has(id) && suit !== 4 && rank === 5) return "0";
  return String(rank);
}
function concealedStr(ids, akaSet) {
  return ids.map((id) => tileDigit(id, akaSet) + SUIT_CHAR2[decodeId(id).suit]).join("");
}
function realMelds(melds) {
  return (melds || []).filter((m) => m.type !== "babei");
}
function furoGroupStr(meld, akaSet) {
  const suit = decodeId(meld.tiles[0]).suit;
  // riichi 用两张牌表示暗杠，必须把红牌保留在这两个代表牌中。
  const tiles = meld.type === "ankan"
    ? [...meld.tiles].sort((a, b) => Number(akaSet?.has(b) || false) - Number(akaSet?.has(a) || false)).slice(0, 2)
    : meld.tiles;
  return tiles.map((id) => tileDigit(id, akaSet)).join("") + SUIT_CHAR2[suit];
}
function furoStr(melds, akaSet) {
  return realMelds(melds).map((m) => furoGroupStr(m, akaSet)).join("+");
}
function handStr(concealedIds, melds, akaSet, opts = {}) {
  let s = concealedStr(concealedIds, akaSet);
  if (opts.ronTile != null) s += "+" + toRiichi(opts.ronTile, akaSet && akaSet.has(opts.ronTile));
  const fs = furoStr(melds, akaSet);
  if (fs) s += "+" + fs;
  let ex = "";
  if (opts.doubleRiichi) ex += "w";
  else if (opts.riichi) ex += "r";
  if (opts.ippatsu) ex += "i";
  if (opts.rinshan || opts.chankan) ex += "k";
  if (opts.haidi && !opts.rinshan && !opts.chankan) ex += "h";
  if (opts.tenho) ex += "t";
  ex += "" + (opts.roundWind || 1) + (opts.seatWind || 1);
  s += "+" + ex;
  if (opts.doraTiles && opts.doraTiles.length) {
    s += "+d" + opts.doraTiles.map((id) => toRiichi(id, false)).join("");
  }
  return s;
}
function calcWin(concealedIds, melds, akaSet, opts = {}) {
  const all = concealedIds.concat(opts.ronTile != null ? [opts.ronTile] : []);
  if (shantenOfCounts(countsOf(all), realMelds(melds).length) !== -1) {
    return { isAgari: false, hasYaku: false, han: 0, fu: 0, ten: 0, yakuman: 0, yaku: {}, name: "", oya: [0], ko: [0] };
  }
  const str = handStr(concealedIds, melds, akaSet, opts);
  let res;
  try {
    const calculator = new Riichi(str.toLowerCase());
    if (opts.rinshan && opts.ronTile == null) {
      // riichi 1.2.0 只识别有杠副露的岭上；雀魂拔北补牌同样可成岭上。
      // 在每个分解的役判定后补役，让原库继续算宝牌、符和最优点数；
      // 不能在 calc() 返回无役/0 符后再加番，也不能修改全局原型。
      const calcYaku = calculator.calcYaku;
      calculator.calcYaku = function () {
        calcYaku.call(this);
        const result = this.tmpResult;
        if (!result.yakuman && !result.yaku["嶺上開花"]) {
          result.yaku["嶺上開花"] = "1飜";
          result.han += 1;
        }
      };
    }
    res = calculator.calc();
  } catch (e) {
    return { isAgari: false, hasYaku: false, han: 0, fu: 0, ten: 0, yakuman: 0, yaku: {}, name: "", oya: [0], ko: [0], error: true };
  }
  const han = res.han || 0;
  const yakuman = res.yakuman || 0;
  return {
    str,
    isAgari: !!res.isAgari && !res.error,
    hasYaku: !!res.isAgari && (han > 0 || yakuman > 0),
    han,
    fu: res.fu || 0,
    ten: res.ten || 0,
    yakuman,
    yaku: res.yaku || {},
    name: res.name || "",
    oya: res.oya || [0, 0, 0],
    ko: res.ko || [0, 0, 0],
    error: !!res.error
  };
}
function handShanten(concealedIds, melds) {
  return shantenOfCounts(countsOf(concealedIds), realMelds(melds).length);
}
function handWaits(concealedIds, melds, remainOf = null) {
  const r = waitsOfCounts(countsOf(concealedIds), realMelds(melds).length, remainOf);
  return {
    shanten: r.shanten,
    waits: r.waits.map((i) => indexToTileId(i)),
    waitKinds: r.waits.map(kindOfIndex),
    ukeire: r.ukeire
  };
}
function chooseDiscard(concealedIds, melds, opts = {}) {
  const {
    drawnTile = null,
    doraKinds = null,
    akaSet = null,
    dangerKinds = null,
    dangerWeight = 1,
    forced = null,
    forbiddenKinds = null,
    remainOf = null,
    maxShantenLoss = 0,
    shantenLossPenalty = 240,
    ukeireWeight = 12
  } = opts;
  const meldCount = realMelds(melds).length;
  const counts = countsOf(concealedIds);
  if (forced != null && concealedIds.includes(forced) && !forbiddenKinds?.has(kindOf(forced))) {
    const c2 = counts.slice();
    c2[tileIndex(forced)]--;
    const w = waitsOfCounts(c2, meldCount, remainOf);
    return {
      discardId: forced,
      shanten: w.shanten,
      ukeire: w.ukeire,
      waits: w.waits.map((i) => indexToTileId(i)),
      score: 0
    };
  }

  const legalOptions = [];
  for (let idx = 0; idx < counts.length; idx++) {
    if (counts[idx] === 0) continue;
    const id = pickIdFromHand(concealedIds, idx, akaSet);
    if (id == null || forbiddenKinds?.has(kindOf(id))) continue;
    counts[idx]--;
    const shanten = shantenOfCounts(counts, meldCount);
    counts[idx]++;
    legalOptions.push({ idx, shanten });
  }
  if (!legalOptions.length) throw new Error("没有合法的可打牌");
  const bestShanten = Math.min(...legalOptions.map((option) => option.shanten));
  const options = legalOptions.filter((option) => option.shanten <= bestShanten + maxShantenLoss);

  let best = null;
  for (const option of options) {
    const id = pickIdFromHand(concealedIds, option.idx, akaSet);
    if (id == null || forbiddenKinds?.has(kindOf(id))) continue;
    counts[option.idx]--;
    const waits = waitsOfCounts(counts, meldCount, remainOf);
    counts[option.idx]++;
    option.waits = waits.waits;
    option.ukeire = waits.ukeire;
    const secondary = discardSecondaryScore(id, concealedIds, {
      drawnTile, doraKinds, akaSet, dangerKinds, dangerWeight
    });
    const totalScore = option.ukeire * ukeireWeight - (option.shanten - bestShanten) * shantenLossPenalty + secondary;
    const candidate = {
      discardId: id,
      shanten: option.shanten,
      ukeire: option.ukeire,
      score: totalScore,
      waits: option.waits.map((i) => indexToTileId(i))
    };
    if (!best || candidate.score > best.score || candidate.score === best.score && candidate.discardId < best.discardId) best = candidate;
  }
  if (!best) {
    const allowed = concealedIds.filter((id) => !forbiddenKinds?.has(kindOf(id)));
    const id = drawnTile != null && allowed.includes(drawnTile) ? drawnTile : allowed[allowed.length - 1];
    if (id == null) throw new Error("没有合法的可打牌");
    return { discardId: id, shanten: bestShanten, ukeire: 0, score: 0, waits: [] };
  }
  return best;
}
function pickIdFromHand(handIds, idx, akaSet) {
  let plain = null, any = null;
  for (const id of handIds) {
    if (tileIndex(id) !== idx) continue;
    any = any == null ? id : any;
    if (!(akaSet && akaSet.has(id))) {
      plain = id;
      break;
    }
  }
  return plain != null ? plain : any;
}
function discardSecondaryScore(tile, handIds, { drawnTile, doraKinds, akaSet, dangerKinds, dangerWeight = 1 }) {
  let s = 0;
  const { suit, rank } = decodeId(tile);
  const kind = suit * 10 + rank;
  if (doraKinds && doraKinds.has(kind)) s -= 100;
  if (akaSet && akaSet.has(tile)) s -= 120;
  const cnt = handIds.filter((x) => kindOf(x) === kind).length;
  if (suit === 4 && cnt === 1) s += 30;
  if (suit !== 4 && (rank === 1 || rank === 9) && cnt === 1) s += 15;
  if (suit !== 4 && (rank === 2 || rank === 8) && cnt === 1) s += 5;
  if (drawnTile != null && tile === drawnTile) s += 10;
  if (dangerKinds) {
    const risk = dangerKinds.riskByKind?.get(kind);
    if (Number.isFinite(risk)) s -= risk * dangerWeight;
    else {
      if (dangerKinds.safe?.has(kind)) s += 60;
      if (dangerKinds.risky?.has(kind)) s -= 80;
    }
  }
  return s;
}

export { kindOf, concealedStr, realMelds, furoGroupStr, furoStr, handStr, calcWin, handShanten, handWaits, chooseDiscard, pickIdFromHand, discardSecondaryScore };
