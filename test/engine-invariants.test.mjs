import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../mockjs/engine.mjs';
import { buildWall } from '../mockjs/tiles.mjs';
import { RiichiMsg } from '../mockjs/proto_enum.mjs';

// 只在对局通知的稳定边界检查；准备阶段尚未同步 remain，结算阶段
// scores 与 players.score 的提交也不在同一时刻，不应视为局中状态。
const stableEvents = new Set([
  RiichiMsg.ENtfGameStart, RiichiMsg.ENtfSendCard, RiichiMsg.ENtfPlayCard,
  RiichiMsg.ENtfQiangCard, RiichiMsg.ENtfQiangCardEnd,
]);

test('四模式多种子自战在通知边界保持实体牌唯一、牌数和点棒守恒', async () => {
  for (const players of [3, 4]) for (const matchLength of ['east', 'hanchan']) {
    for (const seed of [31, 32, 33, 34, 35]) {
      const sanma = players === 3;
      const startScore = sanma ? 35_000 : 25_000;
      const legalIds = new Set(buildWall({ sanma }).tiles);
      const replacementCount = sanma ? 8 : 4;
      let checked = 0;
      const engine = new GameEngine({
        players, matchLength, seed, startScore, speed: 0, autoHuman: true,
        maxHands: 64,
        emit(event) {
          if (!stableEvents.has(event)) return;
          const label = `${players}/${matchLength}/seed=${seed}/hand=${engine.handIndex}/event=${event}`;
          const owned = engine.players.flatMap((p) => [
            ...p.hand, ...p.discards, ...p.melds.flatMap((meld) => meld.tiles),
          ]);
          const live = [...owned, ...engine.wall, ...engine.replacements];
          assert.equal(new Set(live).size, live.length, `实体牌重复：${label}`);
          assert.ok(live.every((id) => legalIds.has(id)), `非法实体牌：${label}`);
          // 引擎保留十张宝牌/里宝指示牌；每次补牌封存一张牌山尾牌。
          const sealedTail = replacementCount - engine.replacements.length;
          assert.equal(live.length + 10 + sealedTail, legalIds.size, `实体牌数：${label}`);
          assert.equal(engine.remain, engine.wall.length, `余牌：${label}`);
          assert.equal(engine.players.reduce((sum, p) => sum + p.score, 0)
            + engine.riichiSticks * 1000, players * startScore, `点棒：${label}`);
          assert.ok(!(engine._expectedDraw && engine._expectedClaim), `同时存在两种动作窗口：${label}`);
          checked++;
        },
      });
      await engine.start();
      assert.ok(checked > 0);
      assert.ok(engine.matchOver);
      assert.ok(engine.handIndex < 64, '不得靠调试局数上限结束正式比赛');
      assert.equal(engine.scores.reduce((sum, score) => sum + score, 0)
        + engine.riichiSticks * 1000, players * startScore);
    }
  }
});
