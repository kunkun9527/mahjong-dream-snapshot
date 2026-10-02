import { shuffle } from './tiles.mjs';
import { buildSichuanWall, legalSichuanDiscards, sichuanKind, sichuanWaitKinds } from './sichuan_hand.mjs';
import { scoreSichuanHand, sichuanKongPayments, sichuanWinPayments } from './sichuan_score.mjs';
import { settleSichuanDraw } from './sichuan_settlement.mjs';
import { chooseSichuanClaim, chooseSichuanDiscard, chooseSichuanExchange, chooseSichuanMissingSuit } from './sichuan_ai.mjs';

const clone = (value) => structuredClone(value);
const suitOf = (tile) => Math.floor(sichuanKind(tile) / 9) + 1;
// 血战胡牌即离场；血流胡牌后继续摸打，仍承担后续付款（ADR 0004）。
const exited = (state, seat) => state.rules.gameType === 5022 && state.players[seat].won;
const activeSeats = (state) => [0, 1, 2, 3].filter((seat) => !exited(state, seat));
const action = (type, tiles = []) => ({ type, tiles });
const actionTypes = (options) => [...new Set(options.map((option) => option.type))];
function sameAction(a, b) {
  if (a.type !== b.type || a.tiles.length !== b.tiles.length) return false;
  const other = [...b.tiles].sort((x, y) => x - y);
  return [...a.tiles].sort((x, y) => x - y).every((tile, index) => tile === other[index]);
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = Math.imul(value ^ value >>> 15, 1 | value);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function emit(state, type, details = {}) {
  state.events.push({ index: state.events.length, type, ...clone(details) });
}

function setPhase(state, phase, turn = null) {
  state.phase = phase;
  state.turn = turn;
  state.windowId += 1;
}

function turnInfo(state, seat) {
  const options = ownOptions(state, seat);
  const legal = new Set(options.filter((option) => option.type === 'discard').map((option) => option.tiles[0]));
  return { actionTypes: actionTypes(options), cantPlays: state.players[seat].hand.filter((tile) => !legal.has(tile)) };
}

function score(state, seat, tile = null, winType = 'ron') {
  const player = state.players[seat];
  let opening = null;
  if (winType === 'tsumo' && !state.interrupted && player.discardCount === 0 && !player.melds.length) {
    if (seat === state.dealer && player.drawCount === 0) opening = 'heaven';
    else if (seat !== state.dealer && player.drawCount === 1) opening = 'earth';
  }
  return scoreSichuanHand(tile === null ? player.hand : [...player.hand, tile], {
    melds: player.melds, missingSuit: player.missingSuit, gameType: state.rules.gameType, topBei: state.rules.topBei,
    winType, opening, afterKong: winType === 'tsumo' && state.turnSource === 'kong',
    lastTile: winType === 'tsumo' && state.wall.length === 0,
  });
}

// 血流胡后锁牌（原文缺项，本地约定见ADR 0004）：不得改变胡牌牌形，只能摸切、再胡，或杠后听牌种类不变。
const locked = (state, seat) => state.rules.gameType === 5021 && state.players[seat].won;

function waitKey(hand, player, melds = player.melds) {
  return sichuanWaitKinds(hand, { melds, missingSuit: player.missingSuit }).join(',');
}

function lockedKongKeepsWaits(player, before, remove, meld) {
  const after = waitKey(player.hand.filter((tile) => !remove.includes(tile)), player, meld);
  return after !== '' && after === before;
}

function ownOptions(state, seat) {
  const player = state.players[seat];
  const isLocked = locked(state, seat);
  const options = isLocked ? [action('discard', [state.drawnTile])]
    : legalSichuanDiscards(player.hand, player.missingSuit).map((tile) => action('discard', [tile]));
  if (state.turnSource !== 'pon' && score(state, seat, null, 'tsumo')) options.push(action('hu'));
  if (state.turnSource === 'pon' || !state.wall.length) return options;
  const groups = new Map();
  for (const tile of player.hand) {
    if (suitOf(tile) === player.missingSuit) continue;
    const kind = sichuanKind(tile);
    if (!groups.has(kind)) groups.set(kind, []);
    groups.get(kind).push(tile);
  }
  const before = isLocked ? waitKey(player.hand.filter((tile) => tile !== state.drawnTile), player) : null;
  const allowed = (tiles, melds) => !isLocked
    || (tiles.includes(state.drawnTile) && lockedKongKeepsWaits(player, before, tiles, melds));
  for (const tiles of groups.values()) {
    if (tiles.length === 4 && allowed(tiles, [...player.melds, { type: 'ankan', tiles }])) options.push(action('ankan', tiles));
  }
  for (const meld of player.melds.filter((item) => item.type === 'pon')) {
    const tiles = groups.get(sichuanKind(meld.tiles[0]));
    if (tiles?.length === 1 && allowed(tiles, player.melds.map((item) => item === meld
      ? { ...item, type: 'kan', tiles: [...item.tiles, ...tiles] } : item))) options.push(action('kakan', tiles));
  }
  return options;
}

function optionsFor(state, seat) {
  if (!Number.isInteger(seat) || seat < 0 || seat > 3) throw new RangeError('无效座位');
  const player = state.players[seat];
  if (state.phase === 'ended' || exited(state, seat)) return [];
  if (state.phase === 'exchange') {
    if (state.exchanges[seat] !== null) return [];
    const options = [];
    for (let suit = 1; suit <= 3; suit += 1) {
      const tiles = player.hand.filter((tile) => suitOf(tile) === suit);
      for (let a = 0; a < tiles.length - 2; a += 1) {
        for (let b = a + 1; b < tiles.length - 1; b += 1) {
          for (let c = b + 1; c < tiles.length; c += 1) options.push(action('exchange', [tiles[a], tiles[b], tiles[c]]));
        }
      }
    }
    return options;
  }
  if (state.phase === 'missing') return player.missingSuit === null ? [1, 2, 3].map((suit) => action('missing', [suit])) : [];
  if (state.phase === 'turn') return state.turn === seat ? ownOptions(state, seat) : [];
  const pending = state.pending;
  return pending?.offers[seat] && pending.responses[seat] === null ? pending.offers[seat].options : [];
}

// 返回实际执行的转移。血流按「血流封顶」限制每家整局累计输分，超出部分不再支付；
// 后续退税/呼叫转移只能依据这些实付账目。
function applyTransfers(state, transfers, reason) {
  const applied = [];
  for (const transfer of transfers) {
    const { from, to } = transfer;
    let { amount } = transfer;
    if (!Number.isSafeInteger(amount) || amount <= 0 || from === to
        || !state.players[from] || !state.players[to]) throw new RangeError('无效积分转移');
    if (state.rules.lossCap !== null) amount = Math.min(amount, Math.max(0, state.rules.lossCap + state.scores[from]));
    if (!amount) continue;
    if (!Number.isSafeInteger(state.scores[from] - amount) || !Number.isSafeInteger(state.scores[to] + amount)) throw new RangeError('积分溢出');
    state.scores[from] -= amount;
    state.scores[to] += amount;
    state.transfers.push({ ...transfer, amount, reason });
    applied.push({ ...transfer, amount });
  }
  return applied;
}

function deltaOf(transfers) {
  const delta = [0, 0, 0, 0];
  for (const { from, to, amount } of transfers) {
    delta[from] -= amount;
    delta[to] += amount;
  }
  return delta;
}

function finish(state, reason) {
  state.pending = null;
  if (reason === 'wall') {
    const settlement = settleSichuanDraw(state.players, state.kongs, state.rules);
    const transfers = settlement.transfers.flatMap((transfer) => applyTransfers(state, [transfer], transfer.reason));
    state.settlement = { ...settlement, transfers, delta: deltaOf(transfers) };
  }
  setPhase(state, 'ended');
  state.endReason = reason;
  emit(state, 'end', { reason, scores: state.scores, settlement: state.settlement });
}

function draw(state, seat, source = 'draw', kongIndex = null) {
  if (!state.wall.length) return finish(state, 'wall');
  const player = state.players[seat];
  const tile = source === 'kong' ? state.wall.pop() : state.wall.shift();
  player.hand.push(tile);
  player.drawCount += 1;
  player.passBei = 0;
  state.turnSource = source;
  state.lastKong = kongIndex;
  state.drawnTile = tile;
  setPhase(state, 'turn', seat);
  // 事件仅保存在服务端；保存此刻的按钮，不能在补发时读取后续回合的候选。
  emit(state, 'draw', { seat, tile, source, remaining: state.wall.length, actionTypes: actionTypes(ownOptions(state, seat)) });
}

function nextDraw(state, from) {
  if (activeSeats(state).length <= 1) return finish(state, 'threeWinners');
  for (let step = 1; step < 4; step += 1) {
    const seat = (from + step) % 4;
    if (!exited(state, seat)) return draw(state, seat);
  }
  throw new Error('没有下一行动者');
}

function commitKong(state, seat, kind, tiles, from = null, meldIndex = null) {
  const player = state.players[seat];
  let waived = false;
  if (kind === 'added') {
    const meld = player.melds[meldIndex];
    waived = meld.waiveAdded;
    meld.type = 'kan';
    meld.tiles.push(...tiles);
    meld.kongKind = kind;
  } else {
    player.melds.push({ type: kind === 'concealed' ? 'ankan' : 'kan', kongKind: kind, tiles: [...tiles], from, waiveAdded: false });
  }
  player.hand = player.hand.filter((tile) => !tiles.includes(tile));
  const payment = sichuanKongPayments({ seat, kind, from, activeSeats: activeSeats(state), baseScore: state.rules.baseScore, waived });
  const transfers = applyTransfers(state, payment.transfers, 'kong');
  state.kongs.push({ seat, kind, transfers, transferred: false });
  state.pending = null;
  state.interrupted = true;
  emit(state, 'kong', { seat, kind, tiles, from, waived, delta: deltaOf(transfers), scores: state.scores, baseScore: state.rules.baseScore });
  draw(state, seat, 'kong', state.kongs.length - 1);
}

function win(state, winners, from = null) {
  const pending = state.pending;
  const active = activeSeats(state);
  const winType = from === null ? 'tsumo' : pending.kind === 'added' ? 'robKong' : 'ron';
  const tile = from === null ? state.drawnTile : pending.tile;
  // 共用同一实体和牌引用，多响不能把放铳牌复制进每家暗手。
  if (winType === 'robKong') {
    state.players[from].hand = state.players[from].hand.filter((id) => id !== tile);
    state.robbedTiles.push(tile);
  }
  const results = [];
  for (const seat of winners) {
    const player = state.players[seat];
    const result = from === null ? score(state, seat, null, winType) : pending.offers[seat].score;
    const payment = sichuanWinPayments({ winner: seat, loser: from, activeSeats: active, bei: result.bei, baseScore: state.rules.baseScore });
    const transfers = applyTransfers(state, payment.transfers, 'win');
    // 血流胡后继续打：自摸牌移入胡牌区，暗手回到13张。血战终局前保留在手中展示。
    if (from === null && state.rules.gameType === 5021) player.hand = player.hand.filter((id) => id !== tile);
    player.won = true;
    player.win = { tile, from, score: result };
    player.wins.push({ tile, from, score: result });
    state.winners.push(seat);
    results.push({ seat, tile, from, score: result, delta: deltaOf(transfers), scores: [...state.scores] });
  }
  let callTransfer = null;
  if (from !== null && pending.kind === 'discard') {
    state.players[from].river[pending.riverIndex].winners = [...winners];
    if (winners.length === 1 && pending.kongIndex !== null) {
      const kong = state.kongs[pending.kongIndex];
      const amount = kong.transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
      if (amount > 0 && !kong.transferred) {
        const [applied] = applyTransfers(state, [{ from, to: winners[0], amount }], 'callTransfer');
        kong.transferred = true;
        if (applied) callTransfer = { from, to: winners[0], amount: applied.amount, scores: [...state.scores] };
      }
    }
  }
  state.pending = null;
  state.interrupted = true;
  emit(state, 'win', { results, winType, callTransfer, baseScore: state.rules.baseScore });
  nextDraw(state, from === null ? winners[0] : from);
}

function resolveClaims(state) {
  const pending = state.pending;
  if (pending.offers.some((offer, seat) => offer !== null && pending.responses[seat] === null)) return;
  const seats = [1, 2, 3].map((step) => (pending.from + step) % 4);
  const winners = seats.filter((seat) => pending.responses[seat]?.type === 'hu');
  if (winners.length) return win(state, winners, pending.from);
  if (pending.kind === 'added') return commitKong(state, pending.from, 'added', [pending.tile], null, pending.meldIndex);
  const caller = seats.find((seat) => ['pon', 'kan'].includes(pending.responses[seat]?.type));
  if (caller !== undefined) {
    const chosen = pending.responses[caller];
    const player = state.players[caller];
    state.players[pending.from].river[pending.riverIndex].claimed = true;
    const tiles = [...chosen.tiles, pending.tile];
    if (chosen.type === 'kan') return commitKong(state, caller, 'exposed', tiles, pending.from);
    player.hand = player.hand.filter((tile) => !chosen.tiles.includes(tile));
    player.melds.push({ type: 'pon', tiles, from: pending.from,
      waiveAdded: pending.offers[caller].options.some((option) => option.type === 'kan') });
    state.pending = null;
    state.interrupted = true;
    state.turnSource = 'pon';
    state.lastKong = null;
    state.drawnTile = null;
    setPhase(state, 'turn', caller);
    emit(state, 'pon', { seat: caller, from: pending.from, tiles, tile: pending.tile, ...turnInfo(state, caller) });
    return;
  }
  state.pending = null;
  emit(state, 'claimPassed', { from: pending.from, tile: pending.tile });
  nextDraw(state, pending.from);
}

function openClaims(state, pending) {
  pending.offers = [null, null, null, null];
  pending.responses = [null, null, null, null];
  for (const seat of activeSeats(state)) {
    if (seat === pending.from) continue;
    const player = state.players[seat];
    const options = [action('pass')];
    const result = score(state, seat, pending.tile, pending.kind === 'added' ? 'robKong' : 'ron');
    if (result && result.bei > player.passBei) options.push(action('hu'));
    const matching = player.hand.filter((tile) => sichuanKind(tile) === sichuanKind(pending.tile));
    if (pending.kind === 'discard' && state.wall.length && suitOf(pending.tile) !== player.missingSuit) {
      if (locked(state, seat)) {
        // 胡后锁牌不能碰；点杠只在听牌种类不变时允许。
        const tiles = [...matching, pending.tile];
        if (matching.length === 3 && lockedKongKeepsWaits(player, waitKey(player.hand, player), matching,
          [...player.melds, { type: 'kan', tiles }])) options.push(action('kan', matching));
      } else {
        // 所有实体组合都是合法候选，不能要求客户端选中服务器偏好的副本。
        for (let a = 0; a < matching.length - 1; a += 1) {
          for (let b = a + 1; b < matching.length; b += 1) options.push(action('pon', [matching[a], matching[b]]));
        }
        if (matching.length === 3) options.push(action('kan', matching));
      }
    }
    if (options.length > 1) pending.offers[seat] = { options, score: result };
  }
  state.pending = pending;
  setPhase(state, 'claim');
  emit(state, 'claimWindow', { kind: pending.kind, from: pending.from, tile: pending.tile,
    actionTypes: pending.offers.map((offer) => offer === null ? [] : actionTypes(offer.options)) });
  resolveClaims(state);
}

function applyAction(state, seat, chosen) {
  const player = state.players[seat];
  if (state.phase === 'exchange') {
    state.exchanges[seat] = [...chosen.tiles];
    if (state.exchanges.every((tiles) => tiles !== null)) {
      for (let target = 0; target < 4; target += 1) {
        const source = (target - state.exchangeOffset + 4) % 4;
        state.players[target].hand = state.players[target].hand.filter((tile) => !state.exchanges[target].includes(tile))
          .concat(state.exchanges[source]);
      }
      // 庄家的原始第14张可能已被换走；天胡展示引用必须属于换牌后的本人手牌。
      if (!state.players[state.dealer].hand.includes(state.drawnTile)) state.drawnTile = state.players[state.dealer].hand.at(-1);
      emit(state, 'exchange', { offset: state.exchangeOffset, selections: state.exchanges });
      setPhase(state, 'missing');
    }
    return;
  }
  if (state.phase === 'missing') {
    player.missingSuit = chosen.tiles[0];
    if (state.players.every((entry) => entry.missingSuit !== null)) {
      setPhase(state, 'turn', state.dealer);
      emit(state, 'missing', { suits: state.players.map((entry) => entry.missingSuit) });
    }
    return;
  }
  if (state.phase === 'claim') {
    const offer = state.pending.offers[seat];
    if (chosen.type !== 'hu' && offer.options.some((option) => option.type === 'hu')) player.passBei = Math.max(player.passBei, offer.score.bei);
    state.pending.responses[seat] = clone(chosen);
    emit(state, 'claimResponse', { seat, action: chosen.type, tiles: chosen.tiles });
    resolveClaims(state);
    return;
  }
  if (chosen.type === 'hu') return win(state, [seat]);
  if (chosen.type === 'ankan') return commitKong(state, seat, 'concealed', chosen.tiles);
  if (chosen.type === 'kakan') {
    const tile = chosen.tiles[0];
    const meldIndex = player.melds.findIndex((meld) => meld.type === 'pon' && sichuanKind(meld.tiles[0]) === sichuanKind(tile));
    // 只开抢杠窗口，暗手、副露与款项在无人抢和后才提交。
    openClaims(state, { kind: 'added', from: seat, tile, meldIndex });
    return;
  }
  const tile = chosen.tiles[0];
  const declinedWin = state.turnSource === 'pon' ? null : score(state, seat, null, 'tsumo');
  if (declinedWin) player.passBei = Math.max(player.passBei, declinedWin.bei);
  player.hand = player.hand.filter((id) => id !== tile);
  player.discardCount += 1;
  player.allDiscardsMissing &&= suitOf(tile) === player.missingSuit;
  player.river.push({ tile, claimed: false, winners: [] });
  emit(state, 'discard', { seat, tile,
    isMoQie: ['draw', 'kong'].includes(state.turnSource) && state.drawnTile === tile });
  openClaims(state, { kind: 'discard', from: seat, tile, riverIndex: player.river.length - 1,
    kongIndex: state.turnSource === 'kong' ? state.lastKong : null });
}

// 独立单局血战状态机：同步、无计时器/网络/钱包；会话层负责把超时映射为合法动作。
// snapshot只供服务端诊断与测试，不可发给客户端或传给AI。
export class SichuanEngine {
  #state;

  constructor({ gameType = 5022, seed = 1, dealer = 0, exchange = true, topBei = 128, baseScore = 1, wall = null } = {}) {
    if (![5021, 5022].includes(gameType) || !Number.isSafeInteger(seed) || !Number.isInteger(dealer) || dealer < 0 || dealer > 3
        || typeof exchange !== 'boolean' || ![128, 256].includes(topBei)
        || (!exchange && topBei !== 256) || !Number.isSafeInteger(baseScore) || baseScore <= 0
        || baseScore > Math.floor(Number.MAX_SAFE_INTEGER / (256 * 1024))) throw new RangeError('无效的四川房间规则');
    const rng = seededRandom(seed);
    const source = wall === null ? shuffle(buildSichuanWall(), rng) : [...wall];
    if (source.length !== 108 || new Set(source).size !== 108) throw new RangeError('牌山必须包含108张唯一实体牌');
    source.forEach(sichuanKind);
    const players = Array.from({ length: 4 }, () => ({ hand: source.splice(0, 13), melds: [], river: [],
      missingSuit: null, won: false, win: null, wins: [], passBei: 0, drawCount: 0, discardCount: 0, allDiscardsMissing: true }));
    const drawnTile = source.shift();
    players[dealer].hand.push(drawnTile);
    // 原文「血流封顶：免费场5120倍、其它场10240倍」恰为房间单次封顶128/256的40倍，按每家整局累计输分上限执行。
    const lossCap = gameType === 5021 ? 40 * topBei * baseScore : null;
    this.#state = { rules: { gameType, topBei, baseScore, exchange, lossCap }, seed, dealer, players, wall: source,
      phase: exchange ? 'exchange' : 'missing', windowId: 1, turn: null, turnSource: 'initial', drawnTile,
      exchanges: [null, null, null, null], exchangeOffset: 1 + Math.floor(rng() * 3), interrupted: false,
      pending: null, lastKong: null, kongs: [], robbedTiles: [], scores: [0, 0, 0, 0], transfers: [],
      winners: [], endReason: null, settlement: null, events: [] };
    emit(this.#state, 'start', { dealer, remaining: source.length });
  }

  get phase() { return this.#state.phase; }
  get windowId() { return this.#state.windowId; }
  snapshot() { return clone(this.#state); }

  legalActions(seat) {
    return clone(optionsFor(this.#state, seat));
  }

  submit(seat, chosen, windowId) {
    if (windowId !== this.#state.windowId || !Number.isSafeInteger(windowId)) return { ok: false, error: 'staleWindow' };
    if (!Number.isInteger(seat) || seat < 0 || seat > 3 || !chosen || typeof chosen !== 'object'
        || Object.keys(chosen).some((key) => !['type', 'tiles'].includes(key))
        || !Array.isArray(chosen.tiles) || chosen.tiles.length > 4
        || !chosen.tiles.every(Number.isSafeInteger) || new Set(chosen.tiles).size !== chosen.tiles.length) return { ok: false, error: 'invalidAction' };
    const legal = optionsFor(this.#state, seat).find((option) => sameAction(option, chosen));
    if (!legal) return { ok: false, error: 'illegalAction' };
    // 在副本上完成所有阶段转换/计分；异常或非法输入不能泄漏半次状态变更。
    const next = clone(this.#state);
    applyAction(next, seat, legal);
    this.#state = next;
    return { ok: true, windowId: next.windowId };
  }

  view(seat) {
    optionsFor(this.#state, seat); // 校验座位
    const state = this.#state;
    const player = state.players[seat];
    const own = new Set([...player.hand, ...player.melds.flatMap((meld) => meld.tiles)]);
    const visible = new Set(state.robbedTiles);
    for (const [other, entry] of state.players.entries()) {
      for (const discard of entry.river) if (!discard.claimed) visible.add(discard.tile);
      // 中途胡牌通知只公开胡牌张（含血流本人已移出暗手的自摸牌），不含整副暗手。
      for (const record of entry.wins) visible.add(record.tile);
      if (other !== seat) {
        for (const meld of entry.melds) if (meld.type !== 'ankan' || state.phase === 'ended') for (const tile of meld.tiles) visible.add(tile);
        // 终局摊牌前不能让AI读取已胡者暗牌。
        if (state.phase === 'ended') for (const tile of entry.hand) visible.add(tile);
      }
    }
    return clone({ seat, phase: state.phase, windowId: state.windowId, turn: state.turn, hand: player.hand,
      melds: player.melds, missingSuit: player.missingSuit,
      visibleTiles: [...visible].filter((tile) => !own.has(tile)), remaining: state.wall.length,
      scores: state.scores, winners: state.winners, endReason: state.endReason,
      missingSuits: state.players.map((entry) => state.phase === 'missing' ? null : entry.missingSuit),
      handCounts: state.players.map((entry) => entry.hand.length),
      claimTile: state.pending?.tile ?? null, options: optionsFor(state, seat) });
  }

  chooseAction(seat) {
    const view = this.view(seat);
    if (!view.options.length) return null;
    if (view.phase === 'exchange') return action('exchange', chooseSichuanExchange(view.hand));
    if (view.phase === 'missing') return action('missing', [chooseSichuanMissingSuit(view.hand)]);
    if (view.phase === 'claim') {
      const has = (type) => view.options.some((option) => option.type === type);
      return chooseSichuanClaim(view, { tile: view.claimTile, canHu: has('hu'), canPon: has('pon'), canKong: has('kan') });
    }
    if (view.options.some((option) => option.type === 'hu')) return action('hu');
    // 基础AI只执行权威候选中的自家杠；牌效搜索可单独增强，不读取未来补牌。
    const kong = view.options.find((option) => ['ankan', 'kakan'].includes(option.type));
    if (kong) return kong;
    const discards = view.options.filter((option) => option.type === 'discard');
    return discards.length === 1 ? discards[0] : action('discard', [chooseSichuanDiscard(view).tile]);
  }
}
