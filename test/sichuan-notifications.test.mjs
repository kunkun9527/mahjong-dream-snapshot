import test from 'node:test';
import assert from 'node:assert/strict';
import { SichuanEngine } from '../mockjs/sichuan_engine.mjs';
import { SichuanSession } from '../mockjs/sichuan_session.mjs';
import { SichuanNotifications } from '../mockjs/sichuan_notifications.mjs';
import { buildSichuanWall } from '../mockjs/sichuan_hand.mjs';
import { MaJiangAction as Action, decodeMaJiangEnvelope } from '../mockjs/majiang_pb.mjs';

const seats = [0, 1, 2, 3];
const waiting = [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29];
const context = () => ({ gameID: 'mock-sichuan-notifications', userIds: [10001, 10002, 10003, 10004],
  initialScores: [100000, 200000, 300000, 400000], scoreType: 1 });
const sort = (values) => [...values].sort((a, b) => a - b);
const act = (type, tiles = []) => ({ type, tiles });

// 单元测试只替换调度：真实引擎逐席执行动作，投影读取真实状态并走正式编码器。
// 文件末尾另外覆盖不替换任何会话方法的计时/AI集成链路。
class ControlledSession extends SichuanSession {
  phaseStatus = 'idle';
  constructor(rules, humanSeat) {
    super({ ...rules, humanSeat });
    this.engine = new SichuanEngine(rules);
    this.humanSeat = humanSeat;
  }
  get status() { return this.engine?.phase === 'ended' ? 'ended' : this.phaseStatus; }
  snapshot() { return this.engine.snapshot(); }
  view() { return { ...this.engine.view(this.humanSeat), status: this.status }; }
}

function rig({ hands = [[], [], [], []], extra = 29, draws = [], tail = [],
  missing = [3, 3, 3, 3], humanSeat = 0, baseScore = 1 } = {}) {
  const pool = buildSichuanWall();
  const take = (kind) => {
    const index = pool.findIndex((tile) => Math.floor(tile / 10) === kind);
    assert.notEqual(index, -1, `牌例不能含第五张${kind}`);
    return pool.splice(index, 1)[0];
  };
  const initial = hands.map((kinds) => kinds.map(take));
  const additional = take(extra);
  const head = draws.map(take);
  const end = tail.map(take);
  for (const hand of initial) while (hand.length < 13) hand.push(pool.shift());
  const session = new ControlledSession({ exchange: false, topBei: 256, baseScore,
    wall: [...initial.flat(), additional, ...head, ...pool, ...end] }, humanSeat);
  const projection = new SichuanNotifications(session, context());
  const frames = [];
  const read = () => {
    const before = session.snapshot();
    const batch = projection.read();
    for (const frame of batch) {
      const decoded = decodeMaJiangEnvelope(frame.bytes);
      assert.equal(decoded.name, frame.name);
      assert.equal(decoded.cmd, frame.cmd);
      assert.equal(decoded.gameNumber, '0');
      assert.deepEqual(decoded.extraLogicData, []);
    }
    frames.push(...batch);
    assert.deepEqual(session.snapshot(), before, '下行投影不改变牌局状态');
    assert.deepEqual(projection.read(), [], '同一批事件不能重复下发');
    return batch;
  };
  const submit = (seat, chosen, collect = true) => {
    assert.ok(chosen, '必须有指定的合法动作');
    assert.equal(session.engine.submit(seat, chosen, session.engine.windowId).ok, true);
    return collect ? read() : [];
  };
  assert.deepEqual(projection.read(), []);
  session.phaseStatus = 'preparing';
  read();
  session.phaseStatus = 'playing';
  read();
  for (const seat of seats) submit(seat, act('missing', [missing[seat]]));
  return { session, engine: session.engine, projection, frames, read, submit };
}

function discard(run, kind, collect = true) {
  const seat = run.engine.snapshot().turn;
  return run.submit(seat, run.engine.legalActions(seat).find((option) => option.type === 'discard'
    && (kind === undefined || Math.floor(option.tiles[0] / 10) === kind)), collect);
}

function passAll(run) {
  const windowId = run.engine.windowId;
  const result = [];
  for (const seat of seats) {
    if (run.engine.phase === 'claim' && run.engine.windowId === windowId && run.engine.legalActions(seat).length) {
      result.push(...run.submit(seat, act('pass')));
    }
  }
  return result;
}

const payloads = (frames, name) => frames.filter((frame) => frame.name === name)
  .map((frame) => decodeMaJiangEnvelope(frame.bytes).payload);
const only = (frames, name) => {
  const values = payloads(frames, name);
  assert.equal(values.length, 1, `${name}应只发送一次`);
  return values[0];
};

function addedKongGame({ humanSeat = 1, rob = false, waived = false } = {}) {
  const waitingFor11 = [12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 29, 29];
  const run = rig({ humanSeat, hands: [[11], [11, 11, waived ? 11 : 28, 12, 13, 14, 21, 22, 23, 24, 25, 26, 29],
    rob ? waitingFor11 : [], []], extra: 19, missing: [1, 3, 3, 1], draws: [31, 32, 33, waived ? 34 : 11] });
  discard(run, 11);
  run.submit(1, run.engine.legalActions(1).find((option) => option.type === 'pon'));
  passAll(run);
  discard(run, 29);
  passAll(run);
  for (let step = 0; run.engine.snapshot().turn !== 1; step += 1) {
    assert.ok(step < 5);
    discard(run);
    passAll(run);
  }
  return run;
}

test('碰牌响应不提前扣暗牌，裁决仅公开两张实体并下发本人弃牌候选', () => {
  for (const humanSeat of seats) {
    const run = rig({ hands: [[11], [11, 11], [], []], missing: [1, 3, 3, 3], humanSeat });
    discard(run, 11);
    const option = run.engine.legalActions(1).find((entry) => entry.type === 'pon');
    const frames = [...run.submit(1, option), ...passAll(run)];
    const response = payloads(frames, 'NtfQiangCard').find((entry) => entry.seat === 1);
    assert.equal(response.action, Action.Peng);
    assert.deepEqual(response.otherCards, humanSeat === 1 ? option.tiles : []);
    const end = only(frames, 'NtfQiangCardEnd');
    assert.deepEqual(end.seats, [1]);
    assert.equal(end.action, Action.Peng);
    assert.equal(end.isFinish, false);
    assert.deepEqual(sort(end.otherCards), sort(option.tiles));
    assert.deepEqual(end.moneyLogs, []);
    for (const row of end.userInfos) {
      assert.deepEqual(row.canPlayActions, humanSeat === 1 && row.seat === 1 ? [Action.Normal] : []);
      assert.deepEqual(row.cantPlays, humanSeat === 1 && row.seat === 1
        ? run.engine.snapshot().players[1].hand.filter((tile) => Math.floor(tile / 100) === 3) : []);
    }
    assert.equal(frames.some((frame) => frame.name === 'NtfSendCard'), false, '碰后不能多摸一张');
    verifyReplay(run.frames, run.engine.snapshot(), humanSeat);
  }
});

test('多人抢牌先逐席确认再统一胡牌，落选碰牌不泄漏暗手且不收碰杠款', () => {
  const run = rig({ hands: [[], waiting, [29, 29], []], missing: [2, 3, 3, 1] });
  discard(run, 29);
  const pon = run.engine.legalActions(2).find((option) => option.type === 'pon');
  const response = run.submit(2, pon);
  assert.deepEqual(response.map((frame) => frame.name), ['NtfQiangCard']);
  assert.deepEqual(only(response, 'NtfQiangCard').otherCards, []);
  assert.deepEqual(run.engine.snapshot().scores, [0, 0, 0, 0]);
  const frames = [...run.submit(1, act('hu')), ...passAll(run)];
  const end = only(frames, 'NtfQiangCardEnd');
  assert.deepEqual(end.seats, [1]);
  assert.equal(end.action, Action.Hu);
  assert.equal(end.isFinish, true);
  assert.deepEqual(end.otherCards, []);
  assert.equal(end.moneyLogs.length, 1);
  assert.equal(end.moneyLogs[0].type, 5);
  assert.equal(run.engine.snapshot().players[2].melds.length, 0);
  verifyReplay(run.frames, run.engine.snapshot(), 0);
});

test('一炮三响按座位顺序逐笔结算后终局，不重复付款或补摸牌', () => {
  const run = rig({ hands: [[], waiting, waiting, waiting], missing: [2, 3, 3, 3], baseScore: 5 });
  discard(run, 29);
  for (const seat of [3, 1]) {
    assert.deepEqual(run.submit(seat, act('hu')).map((frame) => frame.name), ['NtfQiangCard']);
  }
  const frames = run.submit(2, act('hu'));
  assert.deepEqual(frames.map((frame) => frame.name), ['NtfQiangCard', 'NtfQiangCardEnd', 'NtfGameStop']);
  const end = only(frames, 'NtfQiangCardEnd');
  assert.deepEqual(end.seats, [1, 2, 3]);
  assert.equal(end.moneyLogs.length, 3);
  assert.deepEqual(end.moneyLogs.map((log) => log.userInfos.map((row) => Number(row.money))),
    [[-5, 5, 0, 0], [-5, 0, 5, 0], [-5, 0, 0, 5]]);
  const stop = only(frames, 'NtfGameStop');
  assert.deepEqual(stop.huSeats, [1, 2, 3]);
  assert.equal(stop.huCardSeat, 0);
  assert.equal(stop.huCard, run.engine.snapshot().players[1].win.tile);
  assert.deepEqual(stop.moneyLogs, [], '胡牌款已在裁决发送，终局不重复记账');
  assert.equal(run.projection.complete, true);
  verifyReplay(run.frames, run.engine.snapshot(), 0);
});

test('自摸通过出牌通知标记已胡并继续血战，积分和番型来自当次权威事件', () => {
  const run = rig({ hands: [waiting, [], [], []] });
  const frames = run.submit(0, act('hu'));
  assert.deepEqual(frames.map((frame) => frame.name), ['NtfPlayCard', 'NtfSendCard']);
  const win = only(frames, 'NtfPlayCard');
  assert.equal(win.action, Action.Hu);
  assert.equal(win.isFinish, true);
  assert.equal(win.card, run.engine.snapshot().players[0].win.tile);
  assert.equal(win.moneyLogs[0].type, 4);
  const score = run.engine.snapshot().players[0].win.score;
  assert.deepEqual(win.moneyLogs[0].userInfos[0].yiTypes, score.yaku.map((item) => item.yiType));
  assert.equal(run.projection.complete, false);
  verifyReplay(run.frames, run.engine.snapshot(), 0);
});

test('自摸张在局中与荒牌摊牌均只展示一次，四视角保留其余暗手与胡牌信息', () => {
  for (const humanSeat of seats) {
    const run = rig({ hands: [waiting, [], [], []], humanSeat });
    run.submit(0, act('hu'));
    for (let step = 0; run.engine.phase !== 'ended'; step += 1) {
      assert.ok(step < 400, '被动摸打应耗尽牌山');
      if (run.engine.phase === 'claim') passAll(run);
      else discard(run);
    }
    const state = run.engine.snapshot();
    assert.equal(state.endReason, 'wall');
    const stop = only(run.frames, 'NtfGameStop');
    assert.equal(state.players[0].hand.length, 14, '权威层保留自摸实体归属');
    assert.equal(stop.userInfos[0].handCards.length, 13);
    assert.equal(stop.userInfos[0].handCards.includes(state.players[0].win.tile), false);
    assert.deepEqual(stop.userInfos[0].huInfos.map((info) => info.huCard), [state.players[0].win.tile]);
    verifyReplay(run.frames, state, humanSeat);
  }
});

test('暗杠四座位隐藏表示、杠费与补牌严格有序，补摸不能篡改杠事件', () => {
  for (const humanSeat of seats) {
    const run = rig({ hands: [[17, 17, 17, 17], [], [], []], humanSeat, tail: [39] });
    const option = run.engine.legalActions(0).find((entry) => entry.type === 'ankan');
    const frames = run.submit(0, option);
    assert.deepEqual(frames.map((frame) => frame.name), ['NtfPlayCard', 'NtfQiangCardEnd', 'NtfSendCard']);
    const kong = only(frames, 'NtfPlayCard');
    assert.equal(kong.action, Action.AnGang);
    assert.equal(kong.card, humanSeat === 0 ? option.tiles[0] : 0);
    assert.equal(kong.moneyLogs[0].type, 3);
    assert.deepEqual(kong.moneyLogs[0].userInfos.map((row) => Number(row.money)), [6, -2, -2, -2]);
    assert.deepEqual(only(frames, 'NtfQiangCardEnd').moneyLogs, []);
    verifyReplay(run.frames, run.engine.snapshot(), humanSeat);
  }
});

test('明杠只公开三张暗手实体，先裁决扣牌收款再从尾部补牌', () => {
  const run = rig({ hands: [[11], [11, 11, 11], [], []], missing: [1, 3, 3, 3], humanSeat: 1, tail: [39] });
  discard(run, 11);
  const option = run.engine.legalActions(1).find((entry) => entry.type === 'kan');
  const frames = [...run.submit(1, option), ...passAll(run)];
  const end = only(frames, 'NtfQiangCardEnd');
  assert.equal(end.action, Action.MingGang);
  assert.deepEqual(sort(end.otherCards), sort(option.tiles));
  assert.equal(end.moneyLogs[0].type, 1);
  assert.deepEqual(end.moneyLogs[0].userInfos.map((row) => Number(row.money)), [-2, 2, 0, 0]);
  const draw = only(frames, 'NtfSendCard');
  assert.equal(Math.floor(draw.userInfos[1].card / 10), 39);
  assert.ok(frames.findIndex((frame) => frame.name === 'NtfQiangCardEnd') < frames.findIndex((frame) => frame.name === 'NtfSendCard'));
  verifyReplay(run.frames, run.engine.snapshot(), 1);
});

test('无人可抢的补杠只扣第四张，先碰后补的免收标记不会伪造零额钱款', () => {
  for (const waived of [false, true]) {
    const run = addedKongGame({ waived });
    const option = run.engine.legalActions(1).find((entry) => entry.type === 'kakan');
    const frames = run.submit(1, option);
    assert.deepEqual(frames.map((frame) => frame.name), ['NtfPlayCard', 'NtfQiangCardEnd', 'NtfSendCard']);
    const kong = only(frames, 'NtfPlayCard');
    assert.equal(kong.action, Action.PengGang);
    assert.equal(kong.card, option.tiles[0]);
    assert.equal(kong.moneyLogs.length, waived ? 0 : 1);
    if (!waived) assert.equal(kong.moneyLogs[0].type, 2);
    verifyReplay(run.frames, run.engine.snapshot(), 1);
  }
});

test('杠上炮单响逐笔呼叫转移，多响不转移且后续通知分数一致', () => {
  for (const multi of [false, true]) {
    const run = rig({ hands: [[17, 17, 17, 17], waiting, multi ? waiting : [], []],
      missing: [2, 3, 3, 1], tail: [28] });
    run.submit(0, run.engine.legalActions(0).find((option) => option.type === 'ankan'));
    discard(run, 29);
    const frames = [...run.submit(1, act('hu'))];
    if (multi) frames.push(...run.submit(2, act('hu')));
    frames.push(...passAll(run));
    const logs = only(frames, 'NtfQiangCardEnd').moneyLogs;
    assert.deepEqual(logs.map((log) => log.type), multi ? [5, 5] : [5, 11]);
    if (!multi) assert.deepEqual(logs.at(-1).userInfos.map((row) => Number(row.money)), [-6, 6, 0, 0]);
    verifyReplay(run.frames, run.engine.snapshot(), 0);
  }
});

test('抢补杠按原协议先发PengGang开窗口，抢和不收杠款且不补摸，终局按权威碰摊牌', () => {
  for (const humanSeat of seats) {
    const run = addedKongGame({ humanSeat, rob: true, waived: true });
    const option = run.engine.legalActions(1).find((entry) => entry.type === 'kakan');
    const opened = run.submit(1, option);
    assert.deepEqual(opened.map((frame) => frame.name), ['NtfPlayCard']);
    const window = only(opened, 'NtfPlayCard');
    assert.equal(window.action, Action.PengGang);
    assert.equal(window.card, option.tiles[0]);
    assert.deepEqual(window.moneyLogs, [], '窗口期间不能预收杠款');
    for (const row of window.userInfos) {
      assert.deepEqual(row.canQiangActions, humanSeat === 2 && row.seat === 2 ? [Action.Guo, Action.Hu] : []);
    }
    const frames = run.submit(2, act('hu'));
    assert.deepEqual(frames.map((frame) => frame.name), ['NtfQiangCard', 'NtfQiangCardEnd', 'NtfSendCard']);
    const end = only(frames, 'NtfQiangCardEnd');
    assert.deepEqual(end.seats, [2]);
    assert.equal(end.action, Action.Hu);
    assert.deepEqual(end.moneyLogs.map((log) => log.type), [5]);
    const state = run.engine.snapshot();
    assert.equal(state.players[1].melds[0].type, 'pon');
    assert.equal(state.players[2].win.score.winType, 'robKong');
    assert.equal(only(frames, 'NtfSendCard').seat, 3, '抢和后由被抢者下家摸牌，被抢者不补摸');
    verifyReplay(run.frames, state, humanSeat);
  }
});

test('抢补杠全部过后由窗口结束通知收杠款，再从尾部补摸', () => {
  for (const humanSeat of seats) {
    const run = addedKongGame({ humanSeat, rob: true });
    const option = run.engine.legalActions(1).find((entry) => entry.type === 'kakan');
    assert.deepEqual(run.submit(1, option).map((frame) => frame.name), ['NtfPlayCard']);
    const frames = run.submit(2, act('pass'));
    assert.deepEqual(frames.map((frame) => frame.name), ['NtfQiangCard', 'NtfQiangCardEnd', 'NtfSendCard']);
    const end = only(frames, 'NtfQiangCardEnd');
    assert.equal(end.action, Action.Guo);
    assert.deepEqual(end.moneyLogs.map((log) => log.type), [2]);
    assert.equal(only(frames, 'NtfSendCard').seat, 1);
    assert.equal(run.engine.snapshot().players[1].melds[0].type, 'kan');
    verifyReplay(run.frames, run.engine.snapshot(), humanSeat);
  }
});

test('未支持事件使整批编码失败而不吞掉前序出牌，修复输入后仍能一次完整读取', () => {
  const run = rig({ missing: [1, 1, 1, 1], extra: 11 });
  const before = run.engine.snapshot().events.length;
  discard(run, 11, false);
  const snapshot = run.session.snapshot.bind(run.session);
  run.session.snapshot = () => {
    const state = snapshot();
    state.events[before + 2].type = 'mock-unsupported';
    return state;
  };
  assert.throws(() => run.projection.read(), /未适配/);
  assert.throws(() => run.projection.read(), /未适配/);
  run.session.snapshot = snapshot;
  const frames = run.read();
  assert.deepEqual(frames.map((frame) => frame.name), ['NtfPlayCard', 'NtfQiangCardEnd', 'NtfSendCard']);
  verifyReplay(run.frames, run.engine.snapshot(), 0);
});

test('固定牌山荒牌逐笔退税与查大叫，下行余额和终局摊牌保持一致', () => {
  for (const humanSeat of seats) {
    const session = new ControlledSession({ seed: 15, exchange: false, topBei: 256 }, humanSeat);
    const projection = new SichuanNotifications(session, context());
    const frames = [];
    const read = () => {
      frames.push(...projection.read());
      if (frames.some((frame) => frame.name === 'NtfGameStart')) verifyReplay(frames, session.snapshot(), humanSeat);
    };
    session.phaseStatus = 'preparing';
    read();
    session.phaseStatus = 'playing';
    read();
    for (let step = 0; session.engine.phase !== 'ended'; step += 1) {
      assert.ok(step < 1000, '固定牌山应正常终局');
      const seat = seats.find((seat) => session.engine.legalActions(seat).length);
      assert.equal(session.engine.submit(seat, session.engine.chooseAction(seat), session.engine.windowId).ok, true);
      read();
    }
    const state = session.snapshot();
    assert.equal(state.endReason, 'wall');
    assert.deepEqual([...new Set(state.settlement.transfers.map((transfer) => transfer.reason))].sort(), ['ready', 'refund']);
    const stop = only(frames, 'NtfGameStop');
    assert.deepEqual(stop.moneyLogs.map((log) => log.type), state.settlement.transfers.map((transfer) => transfer.reason === 'refund' ? 10 : 9));
    assert.ok(stop.moneyLogs.every((log) => log.userInfos.every((row) => row.yiTypes.length === 0)), '清算不能套用胡牌番型');
    assert.equal(projection.complete, true);
    assert.deepEqual(projection.read(), []);
  }
});

// 权威暗手保留自摸实体的归属；客户端将这张牌单独放在胡牌区，不再算暗手。
function displayedHand(player) {
  return player.hand.filter((tile) => !(player.win?.from === null && tile === player.win.tile));
}

function verifyReplay(frames, state, humanSeat) {
  let hands;
  const melds = seats.map(() => []);
  const won = [false, false, false, false];
  const meldActions = seats.map(() => []);
  const meldAction = (meld) => meld.type === 'pon' ? Action.Peng : meld.type === 'ankan' ? Action.AnGang
    : meld.kongKind === 'added' ? Action.PengGang : Action.MingGang;
  const scores = context().initialScores.slice();
  let pending;
  const robbed = [];
  const remove = (seat, cards) => {
    for (const card of cards) {
      const index = hands[seat].indexOf(seat === humanSeat ? card : 0);
      assert.notEqual(index, -1, `seat=${seat}不能扣不存在的牌${card}`);
      hands[seat].splice(index, 1);
    }
  };
  for (const frame of frames) {
    const { name, payload: message } = decodeMaJiangEnvelope(frame.bytes);
    for (const log of message.moneyLogs ?? []) {
      assert.deepEqual(log.userInfos.map((row) => row.seat), seats);
      assert.equal(log.userInfos.reduce((sum, row) => sum + Number(row.money), 0), 0);
      for (const row of log.userInfos) {
        scores[row.seat] += Number(row.money);
        assert.equal(scores[row.seat], Number(row.finalMoney));
      }
    }
    if (name === 'NtfGameStart') hands = message.userInfos.map((row) => [...row.handCards]);
    if (name === 'NtfChangeCardEnd') {
      for (const row of message.userInfos) { remove(row.seat, row.cards); hands[row.seat].push(...row.getCards); }
    }
    if (name === 'NtfSendCard') {
      hands[message.seat].push(message.userInfos[message.seat].card);
      assert.equal(won[message.seat], false, '已胡席不能再摸牌');
    }
    if (name === 'NtfPlayCard') {
      const { seat, card, action } = message;
      if (action === Action.Normal) { remove(seat, [card]); pending = { seat, card }; }
      else if (action === Action.AnGang) {
        const tiles = seat === humanSeat ? hands[seat].filter((tile) => Math.floor(tile / 10) === Math.floor(card / 10)) : [0, 0, 0, 0];
        assert.equal(tiles.length, 4);
        remove(seat, tiles);
        melds[seat].push(tiles);
        meldActions[seat].push(action);
      } else if (action === Action.PengGang) {
        remove(seat, [card]);
        const meld = melds[seat].find((tiles) => Math.floor(tiles[0] / 10) === Math.floor(card / 10));
        assert.equal(meld?.length, 3);
        meld.push(card);
        meldActions[seat][melds[seat].indexOf(meld)] = action;
        // 每次补杠后都跟一条NtfQiangCardEnd；有候选时该通知就是抢杠窗口。
        pending = { seat, card, added: true };
      } else if (action === Action.Hu) {
        // 原34272先RemoveHandCard，再把胡牌张显示在独立胡牌区域。
        remove(seat, [card]);
        won[seat] = message.isFinish;
      } else assert.fail(`未支持的客户端摸打动作${action}`);
    }
    if (name === 'NtfQiangCardEnd') {
      if ([Action.Peng, Action.MingGang].includes(message.action)) {
        assert.ok(pending);
        const seat = message.seats[0];
        remove(seat, message.otherCards);
        melds[seat].push([...message.otherCards, pending.card]);
        meldActions[seat].push(message.action);
      } else if (message.action === Action.Hu) {
        for (const seat of message.seats) won[seat] = message.isFinish;
        // 原34266不回退被抢的补杠；客户端继续显示四张，直到终局摊牌。
        if (pending?.added) robbed.push(pending);
      } else assert.equal(message.action, Action.Guo);
      pending = null;
    }
    if (name === 'NtfGameStop') {
      assert.equal(message.isFinal, true);
      for (const row of message.userInfos) {
        assert.deepEqual(sort(row.handCards), sort(displayedHand(state.players[row.seat])));
        assert.deepEqual(sort(hands[row.seat]), row.seat === humanSeat ? sort(row.handCards) : row.handCards.map(() => 0));
        assert.equal(Number(row.score), scores[row.seat]);
        assert.equal(Number(row.changeScore), state.scores[row.seat]);
        assert.equal(row.isFinish, won[row.seat]);
        const player = state.players[row.seat];
        assert.deepEqual(row.doorCardsInfos.map((meld) => ({ cards: sort(meld.cards), action: meld.action, qiangSeat: meld.qiangSeat })),
          player.melds.map((meld) => ({ cards: sort(meld.tiles), action: meldAction(meld), qiangSeat: meld.from ?? row.seat })));
        assert.deepEqual(row.huInfos.map((info) => ({ huCard: info.huCard, huType: info.huType })), player.win
          ? [{ huCard: player.win.tile, huType: player.win.from === null ? 1 : player.win.score.winType === 'robKong' ? 3 : 2 }] : []);
      }
    }
  }
  for (const seat of seats) {
    const expectedHand = displayedHand(state.players[seat]);
    assert.deepEqual(sort(hands[seat]), seat === humanSeat ? sort(expectedHand) : Array(expectedHand.length).fill(0));
    // 局中客户端视图：被抢的补杠保持四张并标为PengGang。
    const shown = state.players[seat].melds.map((meld) => {
      const lost = robbed.find((entry) => entry.seat === seat && meld.type === 'pon'
        && Math.floor(entry.card / 10) === Math.floor(meld.tiles[0] / 10));
      return lost ? { tiles: [...meld.tiles, lost.card], action: Action.PengGang } : { tiles: meld.tiles, action: meldAction(meld) };
    });
    assert.deepEqual(melds[seat].map(sort), state.players[seat].melds.map((meld, index) =>
      meld.type === 'ankan' && seat !== humanSeat ? [0, 0, 0, 0] : sort(shown[index].tiles)), '副露逐张实体与隐藏表示一致');
    assert.deepEqual(meldActions[seat], shown.map((entry) => entry.action));
    assert.equal(won[seat], state.players[seat].won);
    assert.equal(scores[seat], context().initialScores[seat] + state.scores[seat]);
  }
}

function fakeClock() {
  let now = 0;
  let sequence = 0;
  const jobs = new Map();
  return { clock: { now: () => now,
    setTimeout(callback, delay) { const id = ++sequence; jobs.set(id, { callback, due: now + delay }); return id; },
    clearTimeout(id) { jobs.delete(id); } },
  next() {
    const entry = [...jobs].sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
    assert.ok(entry, '未结束会话必须有后续任务');
    const [id, job] = entry;
    jobs.delete(id);
    now = Math.max(now, job.due);
    job.callback();
  }, get size() { return jobs.size; } };
}

test('真实会话三类房间四座位断线AI完成，逐更新重建暗手数、实体、副露及逐笔得分', () => {
  const observed = new Set();
  for (const rules of [{ exchange: true, topBei: 128 }, { exchange: true, topBei: 256 }, { exchange: false, topBei: 256 }]) {
    for (const humanSeat of seats) {
      const timer = fakeClock();
      const frames = [];
      const errors = [];
      let projection;
      let finishes = 0;
      const session = new SichuanSession({ seed: 15, ...rules, humanSeat, aiDelayMs: 1, clock: timer.clock,
        onUpdate() {
          frames.push(...projection.read());
          if (frames.some((frame) => frame.name === 'NtfGameStart')) verifyReplay(frames, session.snapshot(), humanSeat);
        }, onError(error) { errors.push(error); }, onFinish() { finishes += 1; } });
      projection = new SichuanNotifications(session, context());
      try {
        session.start();
        session.detach(session.view().connectionId);
        for (let count = 0; !session.matchOver && !errors.length && count < 1000; count += 1) timer.next();
        assert.deepEqual(errors, []);
        assert.equal(session.matchOver, true);
        assert.equal(projection.complete, true);
        assert.equal(finishes, 1);
        assert.equal(timer.size, 0);
        assert.deepEqual(projection.read(), []);
        for (const frame of frames) {
          for (const log of frame.payload.moneyLogs ?? []) observed.add(log.type);
        }
        const stop = only(frames, 'NtfGameStop');
        const state = session.snapshot();
        assert.equal(state.endReason, rules.exchange ? 'threeWinners' : 'wall');
        assert.deepEqual(stop.moneyLogs.map((log) => log.type), (state.settlement?.transfers ?? []).map((transfer) => ({ flower: 8, ready: 9, refund: 10 }[transfer.reason])));
        verifyReplay(frames, state, humanSeat);
      } finally { session.stop(); }
    }
  }
  assert.ok(observed.has(9), '覆盖荒牌查大叫');
});
