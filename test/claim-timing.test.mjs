import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../mockjs/engine.mjs';
import { PlayAction, Result } from '../mockjs/proto_enum.mjs';

function claimWindow(timeBank) {
  const engine = new GameEngine({ players: 3, speed: 0 });
  engine.players = [0, 1, 2].map((seat) => ({
    seat, isHuman: seat === 0, timeBank, hand: seat === 0 ? [451, 452, 411] : [],
  }));
  const can = [[PlayAction.Peng, PlayAction.Guo], [], []];
  engine.expectClaim(0, 1, 453, can[0]);
  engine.aiClaim = () => null;
  engine.confirmRiichiDeclaration = () => {};
  engine.checkSiFengLianDa = () => false;
  let nextDraws = 0;
  engine.turnDraw = async () => { nextDraws++; };
  const done = engine.resolveClaims(1, 453, can);
  return { engine, done, nextDraws: () => nextDraws };
}

for (const bank of [0, 20]) {
  test(`鸣牌延长时间剩余 ${bank} 秒时，仍完整等待基础 5 秒再自动过`, async (t) => {
    t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 100_000 });
    const { engine, done, nextDraws } = claimWindow(bank);
    const duration = (5 + bank) * 1_000;
    t.mock.timers.tick(duration - 1);
    await Promise.resolve();
    assert.ok(engine._expectedClaim);
    assert.ok(engine._pending);
    assert.equal(nextDraws(), 0, '鸣牌窗口到期前不允许下一家摸牌');
    t.mock.timers.tick(1);
    await done;
    assert.equal(nextDraws(), 1);
    assert.equal(engine.players[0].timeBank, 0);
    assert.equal(engine._expectedClaim, null);
    assert.equal(engine._pending, null);
  });
}

test('延长时间耗尽后，基础时间最后一毫秒仍能提交碰牌', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 100_000 });
  const { engine, done, nextDraws } = claimWindow(0);
  let claim;
  engine.executeClaim = async (...args) => { claim = args; };
  t.mock.timers.tick(4_999);
  assert.equal(engine.submitClaim({ action: PlayAction.Peng, otherCards: [451, 452] }), Result.Succ);
  await done;
  assert.deepEqual(claim, [0, PlayAction.Peng, 453, 1, [451, 452]]);
  t.mock.timers.tick(30_000);
  assert.equal(nextDraws(), 0);
  assert.equal(engine.players[0].timeBank, 0);
});

test('鸣牌基础时间内手动过不扣延长时间，且不会残留超时任务', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 100_000 });
  const { engine, done, nextDraws } = claimWindow(20);
  t.mock.timers.tick(4_000);
  assert.equal(engine.submitClaim({ action: PlayAction.Guo }), Result.Succ);
  await done;
  assert.equal(engine.players[0].timeBank, 20);
  t.mock.timers.tick(30_000);
  await Promise.resolve();
  assert.equal(nextDraws(), 1);
});

test('鸣牌使用延长时间只扣本次超出基础 5 秒的部分', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 100_000 });
  const { engine, done } = claimWindow(20);
  t.mock.timers.tick(8_000);
  assert.equal(engine.submitClaim({ action: PlayAction.Guo }), Result.Succ);
  await done;
  assert.equal(engine.players[0].timeBank, 17);
});
