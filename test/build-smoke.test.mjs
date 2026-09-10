import test from 'node:test';
import assert from 'node:assert/strict';

import { encodeMsg, decodeMsg } from '../mockjs/pb.mjs';

test('恢复后的 Protobuf 源码可往返编码动作消息', () => {
  const bytes = encodeMsg('ReqPlayCard', { card: 115, action: 7, isTimeout: false });
  const decoded = decodeMsg('ReqPlayCard', bytes);
  assert.equal(decoded.card, 115);
  assert.equal(decoded.action, 7);
  assert.equal(decoded.isTimeout, false);
});

test('生成的浏览器 bundle 保持原全局导出契约', async () => {
  globalThis.__mj = {};
  await import(`../mock/riichi.js?smoke=${Date.now()}`);
  assert.deepEqual(
    Object.keys(globalThis.__mj.riichi).sort(),
    [
      'GameEngine', 'LiuJuType', 'MSG_NAME', 'ManType', 'PlayAction',
      'RiichiMsg', 'RiichiSession', 'YiType', 'decodeId', 'decodeMsg',
      'encodeMsg', 'tileId', 'tileName',
    ].sort(),
  );
});
