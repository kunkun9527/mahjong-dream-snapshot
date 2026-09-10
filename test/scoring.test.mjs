import test from 'node:test';
import assert from 'node:assert/strict';

import { GameEngine } from '../mockjs/engine.mjs';
import { RiichiMsg } from '../mockjs/proto_enum.mjs';
import { tileId } from '../mockjs/tiles.mjs';

function makePlayer(seat, score = 25_000) {
  return {
    seat,
    isHuman: seat === 0,
    score,
    scoreAtStart: score,
    hand: [],
    melds: [],
    discards: [],
    discardKinds: new Set(),
    riichi: false,
    riichiPending: false,
    riichiTurn: -1,
    ippatsu: false,
    menzen: true,
    waits: [],
    tempFuriten: false,
    riichiFuriten: false,
    drawnTile: null,
    rinshan: false,
  };
}

function scoringEngine(scores) {
  const frames = [];
  const engine = new GameEngine({
    players: 4,
    startScore: 25_000,
    speed: 0,
    maxHands: 1,
    emit: (event, payload) => frames.push({ event, payload }),
  });
  engine.players = scores.map((score, seat) => makePlayer(seat, score));
  engine.scores = scores.slice();
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.handEnded = false;
  engine.honba = 1;
  engine.riichiSticks = 2;
  return { engine, frames };
}

function basicRon(points = 1_000) {
  return {
    isAgari: true,
    hasYaku: true,
    han: 1,
    fu: 30,
    ten: points,
    yakuman: 0,
    yaku: { '立直': '1飜' },
    name: '',
    oya: [500],
    ko: [500, 300],
  };
}

test('双响分别结算，供托与本场棒归放铳者下家侧赢家', async () => {
  const { engine, frames } = scoringEngine([23_000, 25_000, 25_000, 25_000]);
  await engine.endHand({
    type: 'ron',
    winners: [1, 2],
    loser: 0,
    card: tileId(4, 7, 1),
    wins: new Map([[1, basicRon()], [2, basicRon()]]),
  });

  assert.deepEqual(engine.scores, [20_700, 28_300, 26_000, 25_000]);
  assert.equal(engine.riichiSticks, 0);
  const stop = frames.find(({ event }) => event === RiichiMsg.ENtfGameStop)?.payload;
  assert.deepEqual(stop.huSeats, [1, 2]);
  assert.equal(stop.userInfos.find(({ seat }) => seat === 1).totalFan, 1);
  assert.equal(stop.userInfos.find(({ seat }) => seat === 2).totalFan, 1);
});

test('立直宣言牌放铳时撤销立直并退回宣言棒', async () => {
  const { engine } = scoringEngine([24_000, 25_000, 25_000, 25_000]);
  engine.riichiSticks = 1;
  const loser = engine.players[0];
  loser.riichi = true;
  loser.riichiPending = true;
  loser.riichiTurn = 3;
  loser.ippatsu = true;

  const winner = engine.players[1];
  winner.hand = [
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 3],
    [4, 5], [4, 5], [4, 5],
    [4, 7],
  ].map(([suit, rank], index) => tileId(suit, rank, index % 4 + 1));
  winner.waits = [47];

  let result;
  engine.endHand = async (value) => { result = value; };
  await engine.winRons([1], 0, tileId(4, 7, 2));
  assert.equal(loser.score, 25_000);
  assert.equal(loser.riichi, false);
  assert.equal(loser.riichiPending, false);
  assert.equal(engine.riichiSticks, 0);
  assert.deepEqual(result.winners, [1]);
});

test('四麻终局顺位点采用雀魂 5-15', () => {
  const { engine } = scoringEngine([40_000, 30_000, 20_000, 10_000]);
  const infos = engine.buildStopUserInfos([40_000, 30_000, 20_000, 10_000], null, null, null, true);
  assert.deepEqual(infos.map(({ jingSuanScore }) => jingSuanScore), [30, 10, -10, -30]);
});

test('流局终局时未领取的立直棒归第一名', async () => {
  const { engine } = scoringEngine([23_000, 30_000, 25_000, 20_000]);
  await engine.endHand({
    type: 'draw',
    liuJuType: 0,
    tenpai: [false, false, false, false],
    noPenalty: true,
  });
  assert.deepEqual(engine.scores, [23_000, 32_000, 25_000, 20_000]);
  assert.equal(engine.riichiSticks, 0);
});

test('流局满贯按满贯自摸结算且不附加本场棒', async () => {
  const { engine, frames } = scoringEngine([25_000, 25_000, 25_000, 25_000]);
  engine.honba = 3;
  engine.riichiSticks = 0;
  await engine.endHand({
    type: 'draw',
    liuJuType: 0,
    tenpai: [false, false, false, false],
    nagashiWinners: [1],
  });
  assert.deepEqual(engine.scores, [21_000, 33_000, 23_000, 23_000]);
  const stop = frames.find(({ event }) => event === RiichiMsg.ENtfGameStop)?.payload;
  assert.deepEqual(stop.liuJuManGuanSeats, [1]);
});

test('流局满贯要求所有舍牌都是幺九牌且没有被鸣', async () => {
  const { engine } = scoringEngine([25_000, 25_000, 25_000, 25_000]);
  engine.players[0].discards = [tileId(1, 1, 1), tileId(4, 1, 1), tileId(3, 9, 1)];
  engine.players[1].discards = [tileId(1, 1, 2)];
  engine.players[1].discardClaimed = true;
  engine.players[2].discards = [tileId(1, 2, 1)];
  engine.players[3].discards = [tileId(4, 7, 1)];
  for (const player of engine.players) player.hand = [];
  engine.isTenpai = () => false;
  let result;
  engine.endHand = async (value) => { result = value; };
  await engine.exhaustiveDraw();
  assert.deepEqual(result.nagashiWinners, [0, 3]);
});

function daisangen() {
  return {
    isAgari: true, hasYaku: true, han: 13, fu: 40, ten: 32_000, yakuman: 1,
    yaku: { '大三元': '役満' }, name: '役満', oya: [16_000], ko: [16_000, 8_000],
  };
}

test('大三元包牌在荣和时由放铳者与责任者分担', async () => {
  const { engine } = scoringEngine([25_000, 25_000, 25_000, 25_000]);
  engine.honba = 0;
  engine.riichiSticks = 0;
  engine.players[1].pao = { daisangen: 3 };
  await engine.endHand({
    type: 'ron', winners: [1], loser: 2, card: tileId(4, 1, 1),
    wins: new Map([[1, daisangen()]]),
  });
  assert.deepEqual(engine.scores, [25_000, 57_000, 9_000, 9_000]);
});

test('大三元包牌在自摸时由责任者包付', async () => {
  const { engine } = scoringEngine([25_000, 25_000, 25_000, 25_000]);
  engine.honba = 0;
  engine.riichiSticks = 0;
  engine.players[1].pao = { daisangen: 3 };
  await engine.endHand({ type: 'tsumo', winner: 1, win: daisangen() });
  assert.deepEqual(engine.scores, [25_000, 57_000, 25_000, -7_000]);
});

test('第三副三元牌和第四副风牌副露会记录包牌责任者', () => {
  const { engine } = scoringEngine([25_000, 25_000, 25_000, 25_000]);
  const player = engine.players[1];
  player.pao = {};
  player.melds = [45, 46, 47].map((kind) => ({ type: 'pon', tiles: [kind * 10 + 1] }));
  engine.recordPao(player, 2);
  assert.equal(player.pao.daisangen, 2);
  player.melds = [41, 42, 43, 44].map((kind) => ({ type: 'kan', tiles: [kind * 10 + 1] }));
  engine.recordPao(player, 3);
  assert.equal(player.pao.daisuushi, 3);
});

test('终局结算把本地段位变化写入原客户端字段', () => {
  const { engine } = scoringEngine([30_000, 25_000, 23_000, 22_000]);
  engine._finalResult = { rank: { oldLevel: 11, oldPoint: 390, level: 12, point: 400, change: 40 } };
  const info = engine.buildStopUserInfos([30_000, 25_000, 23_000, 22_000], null, null, [false, false, false, false], true)[0];
  assert.equal(info.changePT, 40);
  assert.equal(info.oldPTLevel, 11);
  assert.equal(info.oldPTPoint, 390);
  assert.equal(info.ptLevel, 12);
  assert.equal(info.ptPoint, 400);
});
