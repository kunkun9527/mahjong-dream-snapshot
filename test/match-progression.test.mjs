import test from 'node:test';
import assert from 'node:assert/strict';

import { GameEngine } from '../mockjs/engine.mjs';

function engineFor(matchLength = 'east') {
  const engine = new GameEngine({ players: 4, matchLength, speed: 0 });
  engine.players = [0, 1, 2, 3].map((seat) => ({ seat }));
  engine.finished = false;
  engine.handIndex = 0;
  engine.maxHands = 64;
  return engine;
}

test('东风战东四无人达到必要点时南入', async () => {
  const engine = engineFor('east');
  engine.roundWind = 1;
  engine.juNum = 3;
  engine.dealerSeat = 3;

  await engine.finishHand(false, false, [29_000, 25_000, 24_000, 22_000]);
  assert.equal(engine.finished, false);
  assert.equal(engine.roundWind, 2);
  assert.equal(engine.juNum, 0);
  assert.equal(engine.dealerSeat, 0);
});

test('半庄东四不会提前终局并正常进入南一', async () => {
  const engine = engineFor('hanchan');
  engine.roundWind = 1;
  engine.juNum = 3;
  engine.dealerSeat = 3;

  await engine.finishHand(false, false, [40_000, 25_000, 20_000, 15_000]);
  assert.equal(engine.finished, false);
  assert.equal(engine.roundWind, 2);
  assert.equal(engine.juNum, 0);
  assert.equal(engine.dealerSeat, 0);
});

test('常规最终局支持庄家和了止', () => {
  const engine = engineFor('east');
  engine.roundWind = 1;
  engine.juNum = 3;
  engine.dealerSeat = 3;
  assert.equal(engine.decideGameOver(true, [25_000, 20_000, 20_000, 35_000]), true);
  assert.equal(engine.decideGameOver(true, [35_000, 20_000, 20_000, 25_000]), false);
});

test('延长场达到必要点立即终局，最后一局仍未达到则强制结束', () => {
  const east = engineFor('east');
  east.roundWind = 2;
  east.juNum = 0;
  assert.equal(east.decideGameOver(false, [31_000, 24_000, 23_000, 22_000]), true);
  east.juNum = 3;
  assert.equal(east.decideGameOver(false, [29_000, 25_000, 24_000, 22_000]), true);

  const hanchan = engineFor('hanchan');
  hanchan.roundWind = 3;
  hanchan.juNum = 3;
  assert.equal(hanchan.decideGameOver(false, [29_000, 25_000, 24_000, 22_000]), true);
});

test('三麻与四麻分别采用四万和三万的一位必要点', () => {
  const yonma = engineFor('east');
  yonma.roundWind = 1;
  yonma.juNum = 3;
  assert.equal(yonma.decideGameOver(false, [31_000, 24_000, 23_000, 22_000]), true);

  const sanma = new GameEngine({ players: 3, matchLength: 'east' });
  sanma.players = [0, 1, 2].map((seat) => ({ seat }));
  sanma.roundWind = 1;
  sanma.juNum = 2;
  sanma.handIndex = 0;
  assert.equal(sanma.decideGameOver(false, [39_000, 35_000, 31_000]), false);
  assert.equal(sanma.decideGameOver(false, [40_000, 34_000, 31_000]), true);
});
