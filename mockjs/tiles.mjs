var SUIT_CHAR = { 1: "m", 2: "p", 3: "s", 4: "z" };
function tileId(suit, rank, copy) {
  return suit * 100 + rank * 10 + copy;
}
function decodeId(id) {
  const suit = Math.floor(id / 100);
  const rank = Math.floor(id % 100 / 10);
  const copy = id % 10;
  return { suit, rank, copy };
}
function toRiichi(id, aka = false) {
  const { suit, rank } = decodeId(id);
  const ch = SUIT_CHAR[suit];
  if (!ch) return null;
  if (aka && suit !== 4 && rank === 5) return "0" + ch;
  return rank + ch;
}
function doraFromIndicator(id, sanma = false) {
  const { suit, rank } = decodeId(id);
  if (suit === 4) {
    const next2 = rank <= 4 ? rank === 4 ? 1 : rank + 1 : rank === 7 ? 5 : rank + 1;
    return tileId(4, next2, 1);
  }
  if (sanma && suit === 1) return tileId(1, rank === 9 ? 1 : 9, 1);
  const next = rank === 9 ? 1 : rank + 1;
  return tileId(suit, next, 1);
}
function buildWall({ sanma = false, akaCount = 1 } = {}) {
  const tiles = [];
  const akaSet = /* @__PURE__ */ new Set();
  for (let suit = 1; suit <= 4; suit++) {
    const maxRank = suit === 4 ? 7 : 9;
    for (let rank = 1; rank <= maxRank; rank++) {
      if (sanma && suit === 1 && rank >= 2 && rank <= 8) continue;
      for (let copy = 1; copy <= 4; copy++) {
        tiles.push(tileId(suit, rank, copy));
      }
    }
  }
  for (const suit of [1, 2, 3]) {
    if (akaCount > 0) {
      akaSet.add(tileId(suit, 5, 1));
      if (akaCount > 1) akaSet.add(tileId(suit, 5, 2));
    }
  }
  return { tiles, akaSet };
}
function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
var HAN_ZI = {
  1: "\u4E07",
  2: "\u7B52",
  3: "\u7D22",
  4: "\u5B57"
};
var ZI_NAME = { 1: "\u4E1C", 2: "\u5357", 3: "\u897F", 4: "\u5317", 5: "\u767D", 6: "\u53D1", 7: "\u4E2D" };
function tileName(id) {
  const { suit, rank } = decodeId(id);
  if (suit === 4) return ZI_NAME[rank];
  return rank + HAN_ZI[suit];
}

export { SUIT_CHAR, tileId, decodeId, toRiichi, doraFromIndicator, buildWall, shuffle, tileName };
