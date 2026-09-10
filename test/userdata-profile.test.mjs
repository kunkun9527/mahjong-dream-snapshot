import test from 'node:test';
import assert from 'node:assert/strict';

await import('../mock/proto.js');
await import('../mock/data.js');
await import('../mock/userdata.js');

const { proto: P, data, userdata } = globalThis.__mj;

function statDetail(players, values = {}) {
  return {
    hands: 0, games: 0, placements: Array.from({ length: players }, () => 0),
    wins: 0, dealIns: 0, riichi: 0, calls: 0, tsumo: 0, ron: 0,
    winPoints: 0, winTurns: 0, busts: 0, maxRenchan: 0,
    ...values,
  };
}

function profileInfo(userData, topField, key) {
  const row = userData.row(userdata.DT_PROFILE, '0');
  const block = P.parse(row).find((field) => field[0] === topField)[2];
  for (const field of P.parse(block)) {
    if (field[0] !== 2) continue;
    const entry = P.dict(field[2]);
    if (P.fromUtf8(entry[1]) !== key) continue;
    return P.get(entry[2], 2);
  }
  return null;
}

test('本地分模式战绩写回原客户端 DT42 ProfileInfo', () => {
  const userData = new userdata.UserData(P.b64decode(data.userdataB64), 10_000_001);
  const stats = {
    yonma: { byLength: {
      east: statDetail(4, { games: 2, hands: 9, wins: 3, dealIns: 1, calls: 4, winPoints: 11_600, maxRenchan: 2, winTurns: 21, ron: 2, tsumo: 1, riichi: 3 }),
      hanchan: statDetail(4),
    } },
    sanma: { byLength: {
      east: statDetail(3),
      hanchan: statDetail(3, { games: 1, hands: 7, wins: 2, busts: 1, tsumo: 2 }),
    } },
  };

  const change = userData.updateProfileStats(stats);
  assert.ok(change?.[userdata.DT_PROFILE]);

  const yonmaEast = P.dict(profileInfo(userData, 1, '1_0'));
  assert.equal(yonmaEast[10], 2);
  assert.equal(yonmaEast[11], 9);
  assert.equal(yonmaEast[12], 3);
  assert.equal(yonmaEast[13], 1);
  assert.equal(yonmaEast[14], 4);
  assert.equal(yonmaEast[16], 11_600);
  assert.equal(yonmaEast[18], 2);
  assert.equal(yonmaEast[19], 21);
  assert.equal(yonmaEast[20], 2);
  assert.equal(yonmaEast[21], 1);
  assert.equal(yonmaEast[22], 3);
  assert.equal(P.parse(profileInfo(userData, 1, '1_0')).some((field) => field[0] === 40), false);

  const sanmaHanchan = P.dict(profileInfo(userData, 2, '1_1'));
  assert.equal(sanmaHanchan[10], 1);
  assert.equal(sanmaHanchan[11], 7);
  assert.equal(sanmaHanchan[12], 2);
  assert.equal(sanmaHanchan[17], 1);
  assert.equal(sanmaHanchan[21], 2);
  assert.equal(userData.updateProfileStats(stats), null);
});
