import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../mockjs/engine.mjs';
import { calcWin, furoGroupStr } from '../mockjs/ai.mjs';
import { PlayAction, RiichiMsg } from '../mockjs/proto_enum.mjs';

function fixture(n = 3) {
  const frames = [];
  const engine = new GameEngine({ players: n, speed: 0, maxHands: 1,
    emit: (event, payload) => frames.push({ event, payload }) });
  engine.players = Array.from({ length: n }, (_, seat) => ({
    seat, isHuman: seat === 0, score: 50_000, scoreAtStart: 50_000,
    hand: [], melds: [], discards: [], discardKinds: new Set(),
    menzen: true, riichi: false, riichiTurn: -1, ippatsu: false,
    drawnTile: null, rinshan: false, pao: {}, waits: [], timeBank: 20,
  }));
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.replacements = [];
  engine.remain = 20;
  engine.xunNum = 3;
  engine.firstGoAround = false;
  return { engine, frames };
}

function kitaPlayer(engine) {
  const player = engine.players[1];
  Object.assign(player, {
    hand: [321, 331, 341, 332, 342, 351, 361, 371, 381, 292, 291],
    melds: [{ type: 'pon', tiles: [211, 212, 213], from: 0 },
      { type: 'babei', tiles: [441] }],
    menzen: false, rinshan: true, drawnTile: 291,
  });
  return player;
}

function stopped(frames) {
  return frames.find(({ event }) => event === RiichiMsg.ENtfGameStop).payload;
}

test('无其他役的拔北岭上允许自摸，入口与终局只计算一次岭上役', async () => {
  const { engine, frames } = fixture();
  const p = kitaPlayer(engine);
  const win = calcWin(p.hand, p.melds, engine.akaSet, engine.winOpts(p, false));
  assert.equal(win.hasYaku, true);
  assert.equal(win.yaku['嶺上開花'], '1飜');
  assert.equal(win.han, 1);
  assert.equal(win.fu, 30);
  assert.deepEqual(win.ko, [500, 300, 300]);
  assert.equal(engine.canTsumo(p), true);
  assert.ok(engine.turnActions(1, true).includes(PlayAction.Hu));
  await engine.winTsumo(1);
  // 岭上 1 番 + 北宝 1 番，三麻自摸损：庄 1000、闲 500。
  assert.deepEqual(engine.scores, [49_000, 51_500, 49_500]);
  const info = stopped(frames).userInfos.find(({ seat }) => seat === 1);
  assert.equal(info.totalFan, 2);
  assert.equal(info.baBeiFan, 1);
  assert.equal(info.fu, 30);
});

test('拔北岭上适配仍计算宝牌且不污染普通自摸、荣和及未完成手牌', () => {
  const { engine } = fixture();
  const p = kitaPlayer(engine);
  const opts = { ...engine.winOpts(p, false), doraTiles: [291] };
  const win = calcWin(p.hand, p.melds, engine.akaSet, opts);
  assert.equal(win.han, 3);
  assert.equal(win.yaku['ドラ'], '2飜');
  assert.equal(win.fu, 30);
  assert.equal(calcWin(p.hand, p.melds, engine.akaSet, { ...opts, rinshan: false }).hasYaku, false);
  const ron = calcWin(p.hand.slice(0, -1), p.melds, engine.akaSet,
    { roundWind: 1, seatWind: 2, ronTile: 291 });
  assert.equal(ron.hasYaku, false);
  assert.equal(ron.yaku['嶺上開花'], undefined);
  assert.equal(calcWin(p.hand.slice(0, -1), p.melds, engine.akaSet, opts).isAgari, false);
});

test('常规杠岭上不重复加番，岭上不兼计海底，役满不混入普通岭上役', () => {
  const { engine } = fixture();
  const p = kitaPlayer(engine);
  p.melds[0] = { type: 'kan', tiles: [211, 212, 213, 214], from: 0 };
  engine.remain = 0;
  const win = calcWin(p.hand, p.melds, engine.akaSet, engine.winOpts(p, false));
  assert.equal(win.han, 1);
  assert.equal(win.yaku['嶺上開花'], '1飜');
  assert.equal(win.yaku['海底摸月'], undefined);
  assert.equal(engine.winOpts(p, false).haidi, false);
  const yakuman = calcWin([411, 412, 421, 422, 423], [
    { type: 'pon', tiles: [451, 452, 453] },
    { type: 'pon', tiles: [461, 462, 463] },
    { type: 'pon', tiles: [471, 472, 473] },
    { type: 'babei', tiles: [441] },
  ], new Set(), { rinshan: true, roundWind: 1, seatWind: 2 });
  assert.ok(yakuman.yakuman > 0);
  assert.equal(yakuman.yaku['嶺上開花'], undefined);
});

test('暗杠红宝不依赖四张实体牌的数组顺序且不修改输入', () => {
  const hand = [321, 331, 341, 361, 371, 381, 332, 342, 351, 221, 222];
  const aka = new Set([251]);
  const first = { type: 'ankan', tiles: [251, 252, 253, 254] };
  const last = { type: 'ankan', tiles: [252, 253, 254, 251] };
  const snapshot = structuredClone(last);
  assert.equal(furoGroupStr(last, aka), furoGroupStr(first, aka));
  const a = calcWin(hand, [first], aka, { roundWind: 1, seatWind: 2 });
  const b = calcWin(hand, [last], aka, { roundWind: 1, seatWind: 2 });
  assert.equal(a.yaku['赤ドラ'], '1飜');
  assert.deepEqual(b, a);
  assert.deepEqual(last, snapshot);
});

function paoWin(units = 1, dealer = false, tsumo = true) {
  const total = units * (dealer ? 48_000 : 32_000);
  return { isAgari: true, hasYaku: true, han: 0, fu: 0, ten: total, yakuman: units,
    yaku: { '大三元': '役満', ...(units > 1 ? { '字一色': '役満' } : {}) },
    name: units > 1 ? '2倍役満' : '役満',
    oya: tsumo ? [16_000 * units, 16_000 * units, 16_000 * units] : [48_000 * units],
    ko: tsumo ? [16_000 * units, 8_000 * units, 8_000 * units] : [32_000 * units] };
}

function setPao(engine, winner, responsible) {
  engine.players[winner].pao.daisangen = responsible;
  engine.honba = 2;
}

test('四麻和三麻包牌自摸的本场棒全部由责任者支付，庄闲与混合役满守恒', async () => {
  for (const n of [3, 4]) for (const winner of [0, 1]) for (const units of [1, 2]) {
    const { engine } = fixture(n);
    setPao(engine, winner, 2);
    await engine.endHand({ type: 'tsumo', winner, card: 111, win: paoWin(units, winner === 0) });
    const expected = new Array(n).fill(50_000);
    // 非包部分仍按正常自摸损支付，本场总额不变。
    if (units > 1) for (let seat = 0; seat < n; seat++) {
      if (seat === winner) continue;
      const payment = winner === 0 || seat === 0 ? 16_000 : 8_000;
      expected[seat] -= payment;
      expected[winner] += payment;
    }
    const responsibility = (winner === 0 ? 48_000 : 32_000) + (n - 1) * 200;
    expected[2] -= responsibility;
    expected[winner] += responsibility;
    assert.deepEqual(engine.scores, expected, `n=${n},winner=${winner},units=${units}`);
    assert.equal(engine.scores.reduce((a, b) => a + b), n * 50_000);
  }
});

test('包牌荣和的本场由责任者承担，同一责任放铳者不重复扣款', async () => {
  for (const n of [3, 4]) for (const loser of [0, 2]) for (const units of [1, 2]) {
    const { engine } = fixture(n);
    setPao(engine, 1, 2);
    await engine.endHand({ type: 'ron', winners: [1], loser, card: 111,
      wins: new Map([[1, paoWin(units, false, false)]]) });
    const expected = new Array(n).fill(50_000);
    expected[1] += units * 32_000 + 600;
    expected[loser] -= units * 32_000;
    expected[2] -= 600;
    if (loser !== 2) {
      expected[loser] += 16_000;
      expected[2] -= 16_000;
    }
    assert.deepEqual(engine.scores, expected);
  }
});

test('多响只有上家赢家收本场，后位包牌赢家不会另收本场', async () => {
  const { engine } = fixture(4);
  setPao(engine, 2, 3);
  const ordinary = { isAgari: true, hasYaku: true, han: 1, fu: 30, ten: 1000,
    yakuman: 0, yaku: { '立直': '1飜' }, oya: [1500], ko: [1000] };
  await engine.endHand({ type: 'ron', winners: [1, 2], loser: 0, card: 111,
    wins: new Map([[1, ordinary], [2, paoWin(1, false, false)]]) });
  assert.deepEqual(engine.scores, [32_400, 51_600, 82_000, 34_000]);
});
