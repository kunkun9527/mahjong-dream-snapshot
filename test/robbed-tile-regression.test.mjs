import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../mockjs/engine.mjs';
import { buildWall } from '../mockjs/tiles.mjs';
import { PlayAction, RiichiMsg } from '../mockjs/proto_enum.mjs';

function player(seat, hand = []) {
  return {
    seat, hand, isHuman: false, score: 50_000, melds: [], discards: [],
    discardKinds: new Set(), waits: [], waitTiles: [], riichi: false,
    riichiPending: false, doubleRiichi: false, riichiTurn: -1, ippatsu: false,
    tempFuriten: false, riichiFuriten: false, menzen: true, pao: {},
    drawnTile: null, rinshan: false, timeBank: 20,
  };
}

function setup(kind, multiRon = false) {
  const isNorth = kind === 'babei';
  const card = isNorth ? 441 : kind === 'ankan' ? 111 : 251;
  const winningHand = isNorth
    ? [111, 191, 211, 291, 311, 391, 411, 421, 431, 451, 461, 471, 112]
    : kind === 'ankan'
      ? [191, 192, 211, 291, 311, 391, 411, 421, 431, 441, 451, 461, 471]
      : [111, 121, 131, 141, 151, 161, 311, 321, 331, 231, 241, 451, 452];
  const events = [];
  const engine = new GameEngine({ players: isNorth ? 3 : 4, speed: 0, emit: (id, data) => events.push({ id, data }) });
  engine.players = Array.from({ length: engine.playersN }, (_, seat) => player(seat));
  engine.players[1].hand = winningHand;
  if (multiRon) engine.players[2].hand = [113, 192, 212, 292, 312, 392, 412, 422, 432, 452, 462, 472, 114];
  const donor = engine.players[0];
  donor.hand = kind === 'ankan' ? [111, 112, 113, 114] : [card];
  if (kind === 'kakan') {
    donor.melds = [{ type: 'pon', tiles: [252, 253, 254], from: 2 }];
    donor.menzen = false;
  }
  const reserved = new Set(engine.players.flatMap((p) => p.hand.concat(p.melds.flatMap((m) => m.tiles))));
  const { tiles } = buildWall({ sanma: isNorth });
  donor.hand.push(...tiles.filter((tile) => !reserved.has(tile)).slice(0, 14 - donor.melds.length * 3 - donor.hand.length));
  donor.drawnTile = donor.hand.at(-1); // 也覆盖宣告的不是刚摸到的实体牌。
  engine.akaSet = new Set();
  engine.doraIndicators = [];
  engine.uraIndicators = [];
  engine.deadWall = [];
  engine.replacements = [tiles.at(-1)];
  engine.remain = 30;
  engine.kanCount = 0;
  engine.firstGoAround = false;
  engine.xunNum = 9;
  engine.finishHand = async () => {}; // 保留真实结算与协议构建，只阻止开始下一局。
  for (const p of engine.players) engine.updateWaits(p);
  const physical = engine.players.flatMap((p) => p.hand.concat(p.melds.flatMap((m) => m.tiles)));
  assert.equal(new Set(physical).size, physical.length, '测试手牌不能重复实体牌');
  return { engine, donor, card, events };
}

for (const [kind, label] of [['kakan', '抢加杠'], ['ankan', '国士抢暗杠'], ['babei', '抢北']]) {
  test(`${label}结算时从放铳者暗手移除被抢的实体牌，但不完成杠或拔北`, async () => {
    const { engine, donor, card, events } = setup(kind);
    const before = structuredClone(donor);
    let sawDeclaration = false;
    const emit = engine.emit;
    engine.emit = (id, data) => {
      if (id === RiichiMsg.ENtfPlayCard) {
        sawDeclaration = true;
        assert.deepEqual(donor.hand, before.hand, '抢牌窗口开始前不能移除宣告牌');
        assert.ok(data.userInfos[1].canQiangActions.includes(PlayAction.Hu));
      }
      emit(id, data);
    };
    if (kind === 'babei') await engine.doBaBei(0, card);
    else await engine.doKan(0, card, kind);
    assert.ok(sawDeclaration);
    const stop = events.find((event) => event.id === RiichiMsg.ENtfGameStop)?.data;
    assert.ok(stop, '必须走到真实和牌结算');
    assert.deepEqual(stop.huSeats, [1]);
    assert.equal(stop.huCard, card);
    assert.deepEqual(donor.hand, before.hand.filter((tile) => tile !== card));
    assert.deepEqual(stop.userInfos[0].handCards, donor.hand);
    assert.equal(donor.drawnTile, null);
    assert.deepEqual(donor.melds, before.melds);
    assert.equal(engine.kanCount, 0);
    assert.deepEqual(engine.doraIndicators, []);
  });
}

test('抢北多响只移除一次被抢牌', async () => {
  const { engine, donor, card, events } = setup('babei', true);
  const before = donor.hand.slice();
  await engine.doBaBei(0, card);
  assert.deepEqual(events.find((event) => event.id === RiichiMsg.ENtfGameStop).data.huSeats, [1, 2]);
  assert.deepEqual(donor.hand, before.filter((tile) => tile !== card));
});

test('普通荣和不再移除放铳者手牌', async () => {
  const { engine, donor, card } = setup('babei');
  donor.hand.splice(donor.hand.indexOf(card), 1);
  donor.discards.push(card);
  donor.drawnTile = null;
  const before = structuredClone(donor);
  await engine.winRons([1], 0, card);
  assert.deepEqual(donor, before);
});

test('抢牌的任一赢家不合法时，不能提交手牌或撤销立直状态', async () => {
  const { engine, donor, card } = setup('babei');
  donor.riichi = true;
  donor.riichiPending = true;
  donor.score -= 1_000;
  engine.riichiSticks = 1;
  const before = structuredClone(donor);
  await assert.rejects(engine.winRons([1, 2], 0, card, {}, { robbed: true }), /非法荣和/);
  assert.deepEqual(donor, before);
  assert.equal(engine.riichiSticks, 1);
});

test('被抢的实体牌不在手中时拒绝结算，不能误删末张手牌', async () => {
  const { engine, donor, card, events } = setup('babei');
  donor.hand.splice(donor.hand.indexOf(card), 1);
  const before = structuredClone(donor);
  await assert.rejects(engine.winRons([1], 0, card, {}, { robbed: true }), /被抢牌不在手中/);
  assert.deepEqual(donor, before);
  assert.equal(events.length, 0);
});
