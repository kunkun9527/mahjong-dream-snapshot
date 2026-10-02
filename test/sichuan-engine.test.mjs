import test from 'node:test';
import assert from 'node:assert/strict';
import { SichuanEngine } from '../mockjs/sichuan_engine.mjs';
import { buildSichuanWall, sichuanKind } from '../mockjs/sichuan_hand.mjs';

const act = (type, tiles = []) => ({ type, tiles });
const waiting = [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29];

function rig({ hands = [[], [], [], []], extra = 29, draws = [], tail = [], missing = [3, 3, 3, 3] } = {}) {
  const pool = buildSichuanWall();
  const take = (kind) => {
    const index = pool.findIndex((tile) => Math.floor(tile / 10) === kind);
    assert.notEqual(index, -1, `牌例没有第5张${kind}`);
    return pool.splice(index, 1)[0];
  };
  const initial = hands.map((kinds) => kinds.map(take));
  const additional = take(extra);
  const head = draws.map(take);
  const end = tail.map(take);
  for (const hand of initial) while (hand.length < 13) hand.push(pool.shift());
  const engine = new SichuanEngine({ exchange: false, topBei: 256,
    wall: [...initial.flat(), additional, ...head, ...pool, ...end] });
  for (let seat = 0; seat < 4; seat += 1) submit(engine, seat, act('missing', [missing[seat]]));
  return engine;
}

function submit(engine, seat, chosen) {
  const result = engine.submit(seat, chosen, engine.windowId);
  assert.equal(result.ok, true, JSON.stringify({ seat, chosen, result }));
  invariant(engine);
}

function discardKind(engine, kind) {
  const state = engine.snapshot();
  const tile = state.players[state.turn].hand.find((id) => Math.floor(id / 10) === kind);
  assert.ok(tile, `手牌中必须有${kind}`);
  submit(engine, state.turn, act('discard', [tile]));
}

function passAll(engine) {
  const token = engine.windowId;
  for (let seat = 0; seat < 4 && engine.phase === 'claim' && engine.windowId === token; seat += 1) {
    if (engine.legalActions(seat).length) submit(engine, seat, act('pass'));
  }
}

function invariant(engine) {
  const state = engine.snapshot();
  const owned = [...state.wall, ...state.robbedTiles];
  for (const [seat, player] of state.players.entries()) {
    owned.push(...player.hand, ...player.melds.flatMap((meld) => meld.tiles),
      ...player.river.filter((entry) => !entry.claimed).map((entry) => entry.tile));
    const extra = ['exchange', 'missing'].includes(state.phase) ? seat === state.dealer
      : state.phase === 'turn' && state.turn === seat || state.pending?.kind === 'added' && state.pending.from === seat
        || player.won && player.win.from === null;
    assert.equal(player.hand.length + player.melds.length * 3, 13 + Number(extra), `seat ${seat}: ${state.phase}`);
    if (player.won) assert.deepEqual(engine.legalActions(seat), []);
    for (const meld of player.melds) {
      assert.equal(new Set(meld.tiles.map(sichuanKind)).size, 1);
      assert.equal(meld.tiles.length, meld.type === 'pon' ? 3 : 4);
    }
    const view = engine.view(seat);
    assert.equal(new Set([...view.hand, ...view.melds.flatMap((meld) => meld.tiles), ...view.visibleTiles]).size,
      view.hand.length + view.melds.reduce((sum, meld) => sum + meld.tiles.length, 0) + view.visibleTiles.length);
  }
  assert.equal(owned.length, 108);
  assert.equal(new Set(owned).size, 108);
  assert.deepEqual([...owned].sort((a, b) => a - b), buildSichuanWall());
  assert.equal(state.scores.reduce((sum, points) => sum + points, 0), 0);
  const totals = [0, 0, 0, 0];
  for (const transfer of state.transfers) {
    totals[transfer.from] -= transfer.amount;
    totals[transfer.to] += transfer.amount;
  }
  assert.deepEqual(state.scores, totals);
  assert.equal(state.events.filter((event) => event.type === 'end').length, Number(state.phase === 'ended'));
}

test('换三张同时提交、同色实体校验、定缺保密与输入副本隔离', () => {
  const engine = new SichuanEngine({ seed: 7 });
  invariant(engine);
  const initial = engine.snapshot();
  const picks = [0, 1, 2, 3].map((seat) => engine.chooseAction(seat));
  const before = engine.snapshot();
  assert.equal(engine.submit(0, act('exchange', [before.players[0].hand[0], before.players[0].hand[0], 111]), engine.windowId).ok, false);
  assert.deepEqual(engine.snapshot(), before);
  for (let seat = 0; seat < 3; seat += 1) {
    submit(engine, seat, picks[seat]);
    assert.deepEqual(engine.snapshot().players.map((player) => player.hand), initial.players.map((player) => player.hand));
    assert.equal(engine.submit(seat, picks[seat], engine.windowId).ok, false);
  }
  submit(engine, 3, picks[3]);
  assert.equal(engine.phase, 'missing');
  const exchanged = engine.snapshot();
  for (let seat = 0; seat < 4; seat += 1) {
    const from = (seat - exchanged.exchangeOffset + 4) % 4;
    assert.ok(picks[from].tiles.every((tile) => exchanged.players[seat].hand.includes(tile)));
    submit(engine, seat, act('missing', [3]));
    if (seat < 3) assert.deepEqual(engine.view(3).missingSuits, [null, null, null, null]);
  }
  assert.equal(engine.snapshot().turn, 0);
  exchanged.players[0].hand.length = 0;
  const view = engine.view(0);
  view.hand.length = 0;
  assert.equal(engine.snapshot().players[0].hand.length, 14);
  assert.ok(!('wall' in view) && !('players' in view) && !('events' in view));
});

test('一炮三响等待全部响应才结算，提交顺序不影响得分，终局拒绝重复记账', () => {
  const make = () => rig({ hands: [[], waiting, waiting, waiting], missing: [2, 3, 3, 3] });
  const engine = make();
  discardKind(engine, 29);
  const token = engine.windowId;
  submit(engine, 3, act('hu'));
  assert.deepEqual(engine.snapshot().scores, [0, 0, 0, 0]);
  assert.equal(engine.submit(3, act('hu'), token).ok, false);
  submit(engine, 1, act('hu'));
  assert.deepEqual(engine.snapshot().winners, []);
  submit(engine, 2, act('hu'));
  const end = engine.snapshot();
  assert.equal(end.endReason, 'threeWinners');
  assert.deepEqual(end.winners, [1, 2, 3]);
  assert.deepEqual(end.scores, [-3, 1, 1, 1]);
  assert.equal(end.settlement, null);
  assert.equal(engine.submit(1, act('hu'), engine.windowId).ok, false);
  assert.equal(engine.submit(0, act('discard', [111]), token).ok, false);
  assert.deepEqual(engine.snapshot(), end);
  const other = make();
  discardKind(other, 29);
  for (const seat of [1, 2, 3]) submit(other, seat, act('hu'));
  const alternate = other.snapshot();
  // 最终状态与裁决必须相同；响应事件则忠实保留各自的实际到达顺序。
  assert.deepEqual(alternate.events.filter((event) => event.type === 'claimResponse').map((event) => event.seat), [1, 2, 3]);
  assert.deepEqual(end.events.filter((event) => event.type === 'claimResponse').map((event) => event.seat), [3, 1, 2]);
  const withoutResponses = (state) => ({ ...state, events: state.events.filter((event) => event.type !== 'claimResponse') });
  assert.deepEqual(withoutResponses(alternate), withoutResponses(end));
});

test('过胡挡住下一摸牌前同倍率荣和，自己摸牌后解除', () => {
  const engine = rig({ hands: [[29], [29], waiting, []], extra: 19, missing: [2, 2, 3, 1], draws: [31] });
  discardKind(engine, 29);
  assert.ok(engine.legalActions(2).some((option) => option.type === 'hu'));
  passAll(engine);
  assert.ok(engine.snapshot().players[2].passBei > 0);
  discardKind(engine, 29);
  assert.ok(!engine.legalActions(2).some((option) => option.type === 'hu'));
  passAll(engine);
  assert.equal(engine.snapshot().turn, 2);
  assert.equal(engine.snapshot().players[2].passBei, 0);
});

test('放弃自摸按已放弃的实际倍数记录过胡，不能误用普通荣和倍率', () => {
  const engine = rig({ hands: [waiting, [], [], []] });
  assert.ok(engine.legalActions(0).some((entry) => entry.type === 'hu'));
  discardKind(engine, 29);
  assert.equal(engine.snapshot().players[0].passBei, 32);
});

test('胡优先于碰，已胡退出者不再行动也不付后续杠费', () => {
  const engine = rig({ hands: [[], waiting, [29, 29, 17, 17, 17, 17], []], missing: [2, 3, 3, 1], draws: [31] });
  discardKind(engine, 29);
  const pon = engine.legalActions(2).find((option) => option.type === 'pon');
  submit(engine, 2, pon);
  submit(engine, 1, act('hu'));
  passAll(engine);
  const after = engine.snapshot();
  assert.equal(after.players[2].melds.length, 0);
  assert.equal(after.turn, 2);
  const previous = after.scores[1];
  submit(engine, 2, engine.legalActions(2).find((option) => option.type === 'ankan'));
  assert.equal(engine.snapshot().scores[1], previous);
  assert.deepEqual(engine.snapshot().kongs[0].transfers.map((entry) => entry.from), [0, 3]);
  assert.deepEqual(engine.legalActions(1), []);
});

function addedKongGame({ rob = true, waived = true } = {}) {
  const waitingFor11 = [12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29, 29];
  const engine = rig({ hands: [[11], [11, 11, waived ? 11 : 28, 12, 13, 14, 21, 22, 23, 24, 25, 26, 29], rob ? waitingFor11 : [], []],
    extra: 19, missing: [1, 3, 3, 1], draws: [31, 32, 33, waived ? 34 : 11] });
  discardKind(engine, 11);
  submit(engine, 1, engine.legalActions(1).find((option) => option.type === 'pon'));
  passAll(engine);
  assert.equal(engine.snapshot().turnSource, 'pon');
  assert.ok(!engine.legalActions(1).some((option) => ['kakan', 'ankan', 'hu'].includes(option.type)));
  discardKind(engine, 29);
  passAll(engine);
  // 回到碰牌者的下一次摸牌，期间只打合法牌并跳过响应。
  for (let count = 0; engine.snapshot().turn !== 1; count += 1) {
    assert.ok(count < 5);
    const turn = engine.snapshot().turn;
    submit(engine, turn, engine.legalActions(turn).find((option) => option.type === 'discard'));
    passAll(engine);
  }
  return engine;
}

test('抢补杠仅移走被抢实体，保留原碰且抢和前后均不收杠费', () => {
  const engine = addedKongGame();
  const before = engine.snapshot();
  submit(engine, 1, engine.legalActions(1).find((option) => option.type === 'kakan'));
  assert.equal(engine.phase, 'claim');
  const pending = engine.snapshot();
  assert.deepEqual(pending.players[1].hand, before.players[1].hand);
  assert.equal(pending.players[1].melds[0].type, 'pon');
  assert.deepEqual(pending.scores, before.scores);
  assert.ok(engine.legalActions(2).some((option) => option.type === 'hu'));
  submit(engine, 2, act('hu'));
  passAll(engine);
  const after = engine.snapshot();
  assert.equal(after.kongs.length, 0);
  assert.equal(after.robbedTiles.length, 1);
  assert.equal(after.players[1].melds[0].type, 'pon');
  assert.ok(after.players[2].win.score.yaku.some((item) => item.name === '抢杠胡'));
});

test('有明杠机会先碰再补免收杠费，暗杠不给其他座位泄漏实体', () => {
  const engine = addedKongGame({ rob: false });
  submit(engine, 1, engine.legalActions(1).find((option) => option.type === 'kakan'));
  passAll(engine);
  assert.equal(engine.snapshot().players[1].melds[0].type, 'kan');
  assert.deepEqual(engine.snapshot().kongs[0].transfers, []);
  const concealed = rig({ hands: [[11, 11, 11, 11], [], [], []], extra: 29, missing: [3, 3, 3, 3] });
  const option = concealed.legalActions(0).find((entry) => entry.type === 'ankan');
  submit(concealed, 0, option);
  assert.deepEqual(concealed.snapshot().scores, [6, -2, -2, -2]);
  assert.ok(option.tiles.every((tile) => !concealed.view(1).visibleTiles.includes(tile)));
  assert.equal(concealed.snapshot().turnSource, 'kong');
});

test('普通补杠收每家一倍，点杠只收放杠者两倍并从尾部补牌', () => {
  const added = addedKongGame({ rob: false, waived: false });
  submit(added, 1, added.legalActions(1).find((entry) => entry.type === 'kakan'));
  passAll(added);
  assert.deepEqual(added.snapshot().scores, [-1, 3, -1, -1]);
  assert.equal(added.snapshot().kongs[0].transfers.length, 3);
  const exposed = rig({ hands: [[11], [11, 11, 11], [], []], extra: 29, missing: [1, 3, 3, 3], tail: [39] });
  discardKind(exposed, 11);
  submit(exposed, 1, exposed.legalActions(1).find((entry) => entry.type === 'kan'));
  passAll(exposed);
  assert.deepEqual(exposed.snapshot().scores, [-2, 2, 0, 0]);
  assert.equal(Math.floor(exposed.snapshot().drawnTile / 10), 39);
});

test('杠上炮单响转移当次杠费，多响不转移', () => {
  for (const multi of [false, true]) {
    const engine = rig({ hands: [[17, 17, 17, 17], waiting, multi ? waiting : [], []], extra: 29,
      missing: [2, 3, 3, 1], tail: [28] });
    submit(engine, 0, engine.legalActions(0).find((option) => option.type === 'ankan'));
    discardKind(engine, 29);
    submit(engine, 1, act('hu'));
    if (multi) submit(engine, 2, act('hu'));
    passAll(engine);
    const state = engine.snapshot();
    assert.equal(state.kongs[0].transferred, !multi);
    assert.deepEqual(state.transfers.filter((entry) => entry.reason === 'callTransfer'),
      multi ? [] : [{ from: 0, to: 1, amount: 6, reason: 'callTransfer' }]);
  }
});

test('非法动作、旧窗口、客户端自报倍数不改变任何权威字段', () => {
  const engine = rig();
  const before = engine.snapshot();
  for (const [seat, chosen, token] of [[0, act('discard', [999]), engine.windowId],
    [0, act('chi', [111, 121]), engine.windowId], [1, act('hu'), engine.windowId],
    [0, { ...act('hu'), bei: 999 }, engine.windowId], [0, act('hu'), engine.windowId - 1],
    [4, act('pass'), engine.windowId], [0, act('discard', ['111']), engine.windowId]]) {
    assert.equal(engine.submit(seat, chosen, token).ok, false);
    assert.deepEqual(engine.snapshot(), before);
  }
  assert.throws(() => new SichuanEngine({ exchange: false, topBei: 128 }), /规则/);
  assert.throws(() => new SichuanEngine({ wall: Array(108).fill(111) }), /牌山/);
});

test('天胡地胡只由开局局序提供，换牌后的和牌引用属于本人', () => {
  const heaven = rig({ hands: [waiting, [], [], []] });
  submit(heaven, 0, act('hu'));
  assert.ok(heaven.snapshot().players[0].win.score.yaku.some((entry) => entry.name === '天胡'));
  const earth = rig({ hands: [[], waiting, [], []], extra: 19, draws: [29], missing: [1, 3, 3, 3] });
  submit(earth, 0, earth.legalActions(0).find((entry) => entry.type === 'discard'));
  passAll(earth);
  assert.equal(earth.snapshot().turn, 1);
  submit(earth, 1, act('hu'));
  assert.ok(earth.snapshot().players[1].win.score.yaku.some((entry) => entry.name === '地胡'));
  const exchanged = new SichuanEngine({ seed: 7 });
  const first = exchanged.snapshot();
  const replaceDrawn = exchanged.legalActions(0).find((entry) => entry.tiles.includes(first.drawnTile));
  assert.ok(replaceDrawn);
  submit(exchanged, 0, replaceDrawn);
  for (const seat of [1, 2, 3]) submit(exchanged, seat, exchanged.chooseAction(seat));
  const after = exchanged.snapshot();
  assert.ok(!after.players[0].hand.includes(first.drawnTile));
  assert.ok(after.players[0].hand.includes(after.drawnTile));
});

test('最后一张先给自摸与放铳响应机会，无余牌不得碰杠，海底不加给荣和', () => {
  for (const selfDraw of [false, true]) {
    const engine = rig({ hands: [[], waiting, [], waiting], extra: 19, tail: [29] });
    for (let count = 0; engine.snapshot().wall.length > 0; count += 1) {
      assert.ok(count < 100);
      const state = engine.snapshot();
      if (state.phase === 'claim') { passAll(engine); continue; }
      const options = engine.legalActions(state.turn);
      const discard = options.find((entry) => entry.type === 'discard' && entry.tiles[0] === state.drawnTile)
        ?? options.find((entry) => entry.type === 'discard');
      submit(engine, state.turn, discard);
    }
    const last = engine.snapshot();
    assert.equal(last.phase, 'turn');
    assert.equal(last.turn, 3);
    assert.ok(engine.legalActions(3).some((entry) => entry.type === 'hu'));
    assert.ok(!engine.legalActions(3).some((entry) => ['ankan', 'kakan'].includes(entry.type)));
    if (selfDraw) {
      submit(engine, 3, act('hu'));
      assert.ok(engine.snapshot().players[3].win.score.yaku.some((entry) => entry.name === '海底捞月'));
    } else {
      submit(engine, 3, act('discard', [last.drawnTile]));
      assert.equal(engine.phase, 'claim');
      assert.ok(!engine.legalActions(1).some((entry) => ['pon', 'kan'].includes(entry.type)));
      submit(engine, 1, act('hu'));
      passAll(engine);
      assert.ok(!engine.snapshot().players[1].win.score.yaku.some((entry) => entry.name === '海底捞月'));
    }
    assert.equal(engine.snapshot().endReason, 'wall');
    const end = engine.snapshot();
    assert.equal(engine.submit(3, act('hu'), engine.windowId).ok, false);
    assert.deepEqual(engine.snapshot(), end);
  }
});

test('相同本人视图下交换他家暗牌和未来牌山，不改变AI决策', () => {
  const wall = buildSichuanWall();
  const otherWall = [...wall.slice(0, 13), ...wall.slice(13, 52).reverse(), wall[52], ...wall.slice(53).reverse()];
  const make = (tiles) => {
    const engine = new SichuanEngine({ wall: tiles, exchange: false, topBei: 256 });
    for (const seat of [0, 1, 2, 3]) submit(engine, seat, act('missing', [3]));
    return engine;
  };
  const first = make(wall);
  const second = make(otherWall);
  assert.deepEqual(first.view(0), second.view(0));
  assert.deepEqual(first.chooseAction(0), second.chooseAction(0));
});

test('三类血战房间多庄位AI自战逐动作守恒、确定终局且固定种子可复现', { timeout: 120000 }, () => {
  for (const rules of [{ exchange: false, topBei: 256 }, { exchange: true, topBei: 128 }, { exchange: true, topBei: 256 }]) {
    for (const seed of [4, 5, 6, 7]) {
      const play = () => {
        const engine = new SichuanEngine({ seed, dealer: seed % 4, ...rules });
        let count = 0;
        while (engine.phase !== 'ended') {
          assert.ok(count++ < 400, `seed ${seed} 卡局`);
          const seat = [0, 1, 2, 3].find((value) => engine.legalActions(value).length);
          assert.notEqual(seat, undefined);
          const chosen = engine.chooseAction(seat);
          submit(engine, seat, chosen);
        }
        assert.ok(['wall', 'threeWinners'].includes(engine.snapshot().endReason));
        return engine.snapshot();
      };
      assert.deepEqual(play(), play());
    }
  }
});
