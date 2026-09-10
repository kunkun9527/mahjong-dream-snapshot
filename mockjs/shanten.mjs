import { decodeId, tileId } from './tiles.mjs';

function tileIndex(id) {
  const { suit, rank } = decodeId(id);
  if (suit >= 1 && suit <= 3) return (suit - 1) * 9 + (rank - 1);
  if (suit === 4) return 27 + (rank - 1);
  return -1;
}
function indexToTileId(idx, copy = 1) {
  if (idx < 27) return tileId(Math.floor(idx / 9) + 1, idx % 9 + 1, copy);
  return tileId(4, idx - 27 + 1, copy);
}
function countsOf(ids) {
  const c = new Array(34).fill(0);
  for (const id of ids) {
    const i = tileIndex(id);
    if (i >= 0) c[i]++;
  }
  return c;
}
var YAOCHU = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
var suitCache = /* @__PURE__ */ new Map();
function analyzeGroup(c, allowRuns) {
  const n = c.length;
  let code = 0;
  for (let i = 0; i < n; i++) code = code * 5 + c[i];
  const key = code * 2 + (allowRuns ? 0 : 1);
  const hit = suitCache.get(key);
  if (hit) return hit;
  const res = [];
  for (let i = 0; i < 5; i++) res.push({ p: -1, pp: -1 });
  const rec = (i, sets, partials, hasPair) => {
    if (sets + partials > 5) return;
    if (i >= n) {
      const s = sets > 4 ? 4 : sets;
      const r = res[s];
      if (partials > r.p) r.p = partials;
      if (hasPair && partials > r.pp) r.pp = partials;
      return;
    }
    if (c[i] === 0) {
      rec(i + 1, sets, partials, hasPair);
      return;
    }
    if (c[i] >= 3) {
      c[i] -= 3;
      rec(i, sets + 1, partials, hasPair);
      c[i] += 3;
    }
    if (allowRuns && i + 2 < n && c[i + 1] > 0 && c[i + 2] > 0) {
      c[i]--;
      c[i + 1]--;
      c[i + 2]--;
      rec(i, sets + 1, partials, hasPair);
      c[i]++;
      c[i + 1]++;
      c[i + 2]++;
    }
    if (c[i] >= 2) {
      c[i] -= 2;
      rec(i, sets, partials + 1, true);
      c[i] += 2;
    }
    if (allowRuns && i + 1 < n && c[i + 1] > 0) {
      c[i]--;
      c[i + 1]--;
      rec(i, sets, partials + 1, hasPair);
      c[i]++;
      c[i + 1]++;
    }
    if (allowRuns && i + 2 < n && c[i + 2] > 0) {
      c[i]--;
      c[i + 2]--;
      rec(i, sets, partials + 1, hasPair);
      c[i]++;
      c[i + 2]++;
    }
    c[i]--;
    rec(i, sets, partials, hasPair);
    c[i]++;
  };
  rec(0, 0, 0, false);
  suitCache.set(key, res);
  return res;
}
var G0 = new Array(9);
var G1 = new Array(9);
var G2 = new Array(9);
var G3 = new Array(7);
function stdShanten(t, fixedMelds) {
  for (let i = 0; i < 9; i++) {
    G0[i] = t[i];
    G1[i] = t[9 + i];
    G2[i] = t[18 + i];
  }
  for (let i = 0; i < 7; i++) G3[i] = t[27 + i];
  const groups = [
    analyzeGroup(G0, true),
    analyzeGroup(G1, true),
    analyzeGroup(G2, true),
    analyzeGroup(G3, false)
  ];
  let cur = new Uint8Array(5 * 6 * 2);
  cur[0] = 1;
  for (const g of groups) {
    const next = new Uint8Array(5 * 6 * 2);
    for (let s = 0; s <= 4; s++) {
      for (let p = 0; p <= 5; p++) {
        for (let h = 0; h <= 1; h++) {
          if (!cur[(s * 6 + p) * 2 + h]) continue;
          for (let gs = 0; gs <= 4; gs++) {
            const r = g[gs];
            if (r.p < 0) continue;
            const ns = s + gs;
            if (ns > 4) continue;
            for (const [gp, gh] of [[r.p, h], [r.pp, 1]]) {
              if (gp < 0) continue;
              let np = p + gp;
              if (np > 5) np = 5;
              next[(ns * 6 + np) * 2 + gh] = 1;
            }
          }
        }
      }
    }
    cur = next;
  }
  let best = 99;
  for (let s = 0; s <= 4; s++) {
    for (let p = 0; p <= 5; p++) {
      for (let h = 0; h <= 1; h++) {
        if (!cur[(s * 6 + p) * 2 + h]) continue;
        let total = s + fixedMelds;
        if (total > 4) total = 4;
        let pp = p;
        if (total + pp > 5) pp = 5 - total;
        if (pp < 0) pp = 0;
        let sh = 8 - 2 * total - pp;
        if (total + pp === 5 && !h) sh += 1;
        if (sh < best) best = sh;
      }
    }
  }
  return best;
}
function chiitoiShanten(t) {
  let pairs = 0, kinds = 0;
  for (let i = 0; i < 34; i++) {
    if (t[i] > 0) kinds++;
    if (t[i] >= 2) pairs++;
  }
  let sh = 6 - pairs;
  if (kinds < 7) sh += 7 - kinds;
  return sh;
}
function kokushiShanten(t) {
  let kinds = 0, hasPair = 0;
  for (const i of YAOCHU) {
    if (t[i] > 0) kinds++;
    if (t[i] >= 2) hasPair = 1;
  }
  return 13 - kinds - hasPair;
}
function shantenOfCounts(counts, meldCount = 0) {
  let sh = stdShanten(counts, meldCount);
  if (meldCount === 0) {
    const c = chiitoiShanten(counts);
    if (c < sh) sh = c;
    const k = kokushiShanten(counts);
    if (k < sh) sh = k;
  }
  return sh;
}
function waitsOfCounts(counts, meldCount = 0, remainOf = null) {
  const base2 = shantenOfCounts(counts, meldCount);
  const waits = [];
  let ukeire = 0;
  for (let i = 0; i < 34; i++) {
    if (counts[i] >= 4) continue;
    counts[i]++;
    const sh = shantenOfCounts(counts, meldCount);
    counts[i]--;
    if (sh < base2) {
      waits.push(i);
      ukeire += remainOf ? Math.max(0, remainOf(i)) : 4 - counts[i];
    }
  }
  return { shanten: base2, waits, ukeire };
}
function discardOptionsOfCounts(counts, meldCount = 0, remainOf = null) {
  let bestSh = 99;
  const raw = [];
  for (let i = 0; i < 34; i++) {
    if (counts[i] === 0) continue;
    counts[i]--;
    const sh = shantenOfCounts(counts, meldCount);
    counts[i]++;
    raw.push({ idx: i, shanten: sh });
    if (sh < bestSh) bestSh = sh;
  }
  const options = [];
  for (const r of raw) {
    if (r.shanten !== bestSh) continue;
    counts[r.idx]--;
    const w = waitsOfCounts(counts, meldCount, remainOf);
    counts[r.idx]++;
    options.push({ idx: r.idx, waits: w.waits, ukeire: w.ukeire });
  }
  return { shanten: bestSh, options };
}

export { tileIndex, indexToTileId, countsOf, shantenOfCounts, waitsOfCounts, discardOptionsOfCounts };
