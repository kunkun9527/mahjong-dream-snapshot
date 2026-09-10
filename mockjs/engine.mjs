import { tileId, decodeId, toRiichi, doraFromIndicator, buildWall, shuffle, tileName } from './tiles.mjs';
import { tileIndex, indexToTileId, countsOf, shantenOfCounts, waitsOfCounts, discardOptionsOfCounts } from './shanten.mjs';
import { kindOf, concealedStr, realMelds, furoGroupStr, furoStr, handStr, calcWin, handShanten, handWaits, chooseDiscard, pickIdFromHand, discardSecondaryScore } from './ai.mjs';
import { Result, RiichiMsg, PlayAction, ManType, YiType, LiuJuType } from './proto_enum.mjs';
import { mapYaku, manTypeFromResult } from './yaku_map.mjs';

var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
var kindOf2 = (id) => {
  const d = decodeId(id);
  return d.suit * 10 + d.rank;
};
var GameEngine = class {
  constructor(opts = {}) {
    const {
      players = 4,
      akaCount = 1,
      startScore = 25e3,
      emit,
      seed
    } = opts;
    this.playersN = players;
    this.sanma = players === 3;
    this.akaCount = akaCount;
    this.startScore = startScore;
    this.emit = emit || (() => {
    });
    this.autoHuman = !!opts.autoHuman;
    this.speed = opts.speed != null ? opts.speed : 1;
    this.baseTime = opts.baseTime != null ? opts.baseTime : 5;
    this.extraTime = opts.extraTime != null ? opts.extraTime : 20;
    this.internalState = { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false };
    this.setInternalState(opts.internalState || {});
    this.seed = seed != null ? Number(seed) >>> 0 : null;
    this.rng = this.seed != null ? mulberry32(this.seed) : Math.random;
    this.handIndex = 0;
    this.juNum = 0;
    this.matchLength = opts.matchLength === "hanchan" ? "hanchan" : "east";
    this.regularWinds = this.matchLength === "hanchan" ? 2 : 1;
    this.maxHands = opts.maxHands != null ? opts.maxHands : this.matchLength === "hanchan" ? 64 : 32;
    this.roundWind = 1;
    this.honba = 0;
    this.renchanCount = 0;
    this.riichiSticks = 0;
    this.dealerSeat = 0;
    this.scores = null;
    this.xunNum = 0;
    this._pending = null;
    this._processing = false; // 动作执行中标记（防重复包重放）
    this._expectedDraw = null;
    this._expectedClaim = null;
    this._nextCantPlays = null;
    this._bufferedDraw = null;
    this._bufferedClaim = null;
    this._prepareWaiter = null;
    this._prepared = false;
    this.matchOver = false;
    this.finished = false;
    this.onFinish = opts.onFinish || null;
    this.onFinalResult = opts.onFinalResult || null;
    this._finalResult = null;
    this.matchStats = { hands: 0, wins: 0, dealIns: 0, riichi: 0, calls: 0, tsumo: 0, ron: 0, winPoints: 0, winTurns: 0, maxRenchan: 0 };
    this.uids = opts.uids && opts.uids.length >= players ? opts.uids.slice(0, players) : Array.from({ length: players }, (_, s) => 1e4 + s);
  }
  uidOf(seat) {
    return this.uids[seat];
  }
  /** 客户端上行 ReqPrepare：解开 runHand 里的等待 */
  submitPrepare() {
    this._prepared = true;
    const w = this._prepareWaiter;
    this._prepareWaiter = null;
    if (w) w();
  }
  /** 等客户端点「准备」。抓包规律（dongfeng1 完整包）：
   *  局间（含连庄，isFinal=false）服务器先发 NtfToPrepare/NtfPrepare(机器人)，客户端发
   *  ReqPrepare，服务器再发 NtfPrepare(自己)/NtfGameStart —— 每局等一次 ReqPrepare。
   *  终局（isFinal=true）后引擎直接停，不存在“续场再等一次 ReqPrepare”的两段式握手；
   *  新一场是重新匹配出的新房间、新引擎（见 finishHand）。
   *  autoHuman（自测无客户端）直接跳过；真人模式留一个兜底超时防止卡死。 */
  waitPrepare(timeoutMs = 15e3) {
    if (this.autoHuman) return Promise.resolve();
    if (this._prepared) {
      this._prepared = false;
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let done = false;
      const fin = () => {
        if (done) return;
        done = true;
        this._prepared = false;
        resolve();
      };
      this._prepareWaiter = fin;
      setTimeout(() => {
        if (done) return;
        this.log && this.log("[riichi] \u7B49 ReqPrepare \u8D85\u65F6\uFF0C\u81EA\u884C\u5F00\u5C40");
        fin();
      }, timeoutMs);
    });
  }
  _d(ms) {
    return this.speed > 0 ? sleep(ms * this.speed) : Promise.resolve();
  }
  // 各阶段延迟（毫秒，乘以 speed）
  get T() {
    return { think: 550, claim: 350, step: 250, hand: 2500 };
  }
  // ================= 入口 =================
  async start() {
    await this._d(400);
    while (!this.finished) {
      await this.runHand();
    }
    if (this.onFinish) this.onFinish(this.scores);
  }
  // ================= 一局 =================
  async runHand() {
    this.handEnded = false;
    this._expectedDraw = null;
    this._expectedClaim = null;
    this._nextCantPlays = null;
    this.xunNum = 0;
    this.kanCount = 0;
    this.firstGoAround = true;
    this.lastDiscard = null;
    const { tiles, akaSet } = buildWall({ sanma: this.sanma, akaCount: this.akaCount });
    this.akaSet = akaSet;
    const wall = shuffle(tiles, this.rng);
    // 王牌总数：四麻14张、三麻18张（三麻拔北规则需8张岭上牌，故王牌扩为18张，宝牌指示牌仍为5张）
    const deadLen = this.sanma ? 18 : 14;
    const dead = wall.splice(wall.length - deadLen, deadLen);
    this.deadWall = dead;
    const rinLen = this.sanma ? 8 : 4;
    this.replacements = dead.slice(0, rinLen);
    // 初始宝牌指示牌位置：四麻 dead[4]；三麻前8张是岭上，故 dead[8]（两者均为5张宝牌指示牌，布局一致）
    const baoBase = this.sanma ? 8 : 4;
    this.doraIndicators = [dead[baoBase]];
    this.uraIndicators = [dead[baoBase + 1]];
    this._pendingBaoPreCard = 0;
    this._deferredKanDora = 0;
    this.wall = wall;
    this.remain = wall.length;
    const players = [];
    for (let s = 0; s < this.playersN; s++) {
      const score = this.scores ? this.scores[s] : this.startScore;
      players.push({
        seat: s,
        isHuman: s === 0,
        score,
        scoreAtStart: score,
        timeBank: s === 0 ? this.extraTime : 0,
        hand: wall.splice(0, 13).sort((a, b) => a - b),
        melds: [],
        discards: [],
        discardClaimed: false,
        discardKinds: /* @__PURE__ */ new Set(),
        riichi: false,
        doubleRiichi: false,
        riichiTurn: -1,
        riichiPending: false,
        ippatsu: false,
        menzen: true,
        waits: [],
        tempFuriten: false,
        riichiFuriten: false,
        pao: {},
        drawnTile: null,
        rinshan: false
      });
    }
    this.players = players;
    for (const p of players) this.updateWaits(p);
    const emptyInfos = players.map(() => ({}));
    this.emit(RiichiMsg.ENtfToPrepare, {
      userInfos: players.map((p) => ({ seat: p.seat, userID: this.uidOf(p.seat) }))
    });
    for (let s = 1; s < this.playersN; s++) {
      this.emit(RiichiMsg.ENtfPrepare, { seat: s, userInfos: emptyInfos });
    }
    await this.waitPrepare();
    if (this.finished) return;
    this.emit(RiichiMsg.ENtfPrepare, { seat: 0, userInfos: emptyInfos });
    await this._d(this.T.step);
    const dealer = players[this.dealerSeat];
    const firstTile = this.wall.shift();
    this.remain = this.wall.length;
    dealer.hand.push(firstTile);
    dealer.drawnTile = firstTile;
    dealer.rinshan = false;
    this.xunNum = 1;
    const dealerActions = this.turnActions(this.dealerSeat, true);
    this.expectDraw(this.dealerSeat, true, dealerActions, []);
    this.emit(RiichiMsg.ENtfGameStart, {
      changWind: this.roundWind - 1,
      juNum: this.juNum + 1,
      // 实机是 1 基（东1=1），内部保持 0 基
      benChangNum: this.honba,
      zhuangSeat: this.dealerSeat,
      baoPreCard: this.doraIndicators[0],
      remainDuiCardNum: this.remain,
      userInfos: players.map((p) => {
        const own = p.isHuman || this.autoHuman;
        const isDealer = p.seat === this.dealerSeat;
        return {
          seat: p.seat,
          score: p.score,
          initScore: this.startScore,
          handCards: own ? p.hand.slice() : [],
          tingInfos: [],
          canPlayActions: own && isDealer ? dealerActions : [],
          xunNum: isDealer ? 1 : 0
        };
      }),
      leftTimer: this.extraTime,
      defaultMinTimeout: this.baseTime,
      riichiBangNum: this.riichiSticks,
      isAllLast: this.isAllLast(),
      gameID: "mock-" + Date.now() + "-" + this.handIndex,
      duiCardsStrEncode: "",
      duiCardsStrSaltEncode: "",
      ServerRedundantTimeOut: 3,
      FirstGameStartRedundantTimeOut: 8
    });
    await this._d(this.T.step);
    await this.awaitTurn(this.dealerSeat, true, true);
  }
  nextSeat(s) {
    return (s + 1) % this.playersN;
  }
  seatWindOf(seat) {
    return ((seat - this.dealerSeat) % this.playersN + this.playersN) % this.playersN + 1;
  }
  isAllLast() {
    return this.roundWind > this.regularWinds || this.roundWind === this.regularWinds && this.juNum === this.playersN - 1;
  }
  // ================= 摸牌 =================
  async turnDraw(seat) {
    if (this.handEnded) return;
    if (this.remain <= 0) {
      await this.exhaustiveDraw();
      return;
    }
    const p = this.players[seat];
    p.tempFuriten = false;
    const tile = this.wall.shift();
    this.remain = this.wall.length;
    p.hand.push(tile);
    p.drawnTile = tile;
    p.rinshan = false;
    this.xunNum++;
    await this.awaitTurn(seat, true);
  }
  // 岭上摸牌（杠后）
  async drawReplacement(seat) {
    const p = this.players[seat];
    p.tempFuriten = false;
    if (!this.replacements.length || this.remain <= 0) {
      await this.exhaustiveDraw();
      return false;
    }
    const tile = this.replacements.pop();
    this.wall.pop();
    this.remain = this.wall.length;
    p.hand.push(tile);
    p.drawnTile = tile;
    p.rinshan = true;
    this.xunNum++;
    return true;
  }
  async doBaBei(seat, tile) {
    const p = this.players[seat];
    const canQiang = this.players.map((player) => {
      if (player.seat === seat || !this.canRon(player, tile)) return [];
      return [PlayAction.Hu, PlayAction.Guo];
    });
    this.expectClaim(0, seat, tile, canQiang[0] || []);
    this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, tile, PlayAction.BaBei, false, canQiang));
    await this._d(this.T.claim);
    if (await this.resolveKanRob(seat, tile, canQiang, {})) return;

    p.hand.splice(p.hand.indexOf(tile), 1);
    p.melds.push({ type: "babei", tiles: [tile] });
    for (const player of this.players) player.ippatsu = false;
    this.firstGoAround = false;
    if (!await this.drawReplacement(seat)) return;
    await this.awaitTurn(seat, true);
  }
  expectDraw(seat, drew, actions, cantPlays = []) {
    if (this.autoHuman || !this.players[seat]?.isHuman) {
      this._expectedDraw = null;
      return;
    }
    this._processing = false;
    this._expectedDraw = { seat, drew, actions: actions.slice(), cantPlays: cantPlays.slice() };
  }
  validateTurnPayload(payload, expected = this._expectedDraw) {
    if (!expected || !this.players?.[expected.seat]) return Result.Fail_InvalidSequence;
    const p = this.players[expected.seat];
    const action = Number(payload?.action);
    const card = Number(payload?.card);
    if (!Number.isInteger(action)) return Result.Fail_InvalidParam;
    if (!expected.actions.includes(action)) return Result.Fail_ActionNotInCanPlayActions;
    if (action === PlayAction.Hu || action === PlayAction.JiuZhongJiuLiuJu) return Result.Succ;

    if (!Number.isInteger(card) || !p.hand.includes(card)) return Result.Fail_CardNotInHand;
    if (expected.cantPlays.includes(kindOf2(card) * 10)) return Result.Fail_CardInCantPlays;

    if (action === PlayAction.Riichi) {
      const hand = p.hand.slice();
      hand.splice(hand.indexOf(card), 1);
      if (!this.isFormalTenpaiHand(hand, p.melds)) return Result.Fail_RiichiPlayCardWrong;
    }
    if (action === PlayAction.AnGang) {
      const allowed = this.concealedQuadTiles(p).some((tile) => kindOf2(tile) === kindOf2(card));
      if (!allowed) return Result.Fail_CardNotMatchAction;
    }
    if (action === PlayAction.PengGang) {
      const matchesPon = p.melds.some((meld) => meld.type === "pon" && kindOf2(meld.tiles[0]) === kindOf2(card));
      if (!matchesPon) return Result.Fail_CardNotMatchAction;
    }
    if (action === PlayAction.BaBei) {
      const { suit, rank } = decodeId(card);
      if (suit !== 4 || rank !== 4 || p.riichi && card !== p.drawnTile) return Result.Fail_CardNotMatchAction;
    }
    if (action === PlayAction.Normal && p.riichi && p.riichiTurn !== this.xunNum && card !== p.drawnTile) {
      return Result.Fail_CardNotMatchAction;
    }
    return Result.Succ;
  }
  expectClaim(seat, discarderSeat, card, actions) {
    if (this.autoHuman || !this.players[seat]?.isHuman || !actions?.length) {
      this._expectedClaim = null;
      return;
    }
    this._processing = false;
    this._expectedClaim = { seat, discarderSeat, card, actions: actions.slice() };
  }
  validateClaimPayload(payload, expected = this._expectedClaim) {
    if (!expected || !this.players?.[expected.seat]) return Result.Fail_InvalidSequence;
    const action = Number(payload?.action);
    if (!Number.isInteger(action)) return Result.Fail_InvalidParam;
    if (!expected.actions.includes(action)) return Result.Fail_ActionNotInCanQiangActions;
    if (action === PlayAction.Guo || action === PlayAction.Hu) return Result.Succ;

    const p = this.players[expected.seat];
    const otherCards = Array.isArray(payload?.otherCards) ? payload.otherCards.map(Number) : [];
    const needed = action === PlayAction.MingGang ? 3 : 2;
    if (otherCards.length !== needed || new Set(otherCards).size !== otherCards.length || otherCards.some((tile) => !p.hand.includes(tile))) {
      return Result.Fail_InvalidOtherCards;
    }
    const claimedKind = kindOf2(expected.card);
    if (action === PlayAction.Peng || action === PlayAction.MingGang) {
      return otherCards.every((tile) => kindOf2(tile) === claimedKind) ? Result.Succ : Result.Fail_InvalidOtherCards;
    }
    if (action === PlayAction.Chi) {
      if (this.sanma || expected.seat !== this.nextSeat(expected.discarderSeat)) return Result.Fail_InvalidOtherCards;
      const all = [...otherCards, expected.card].map(decodeId);
      if (all.some((tile) => tile.suit === 4 || tile.suit !== all[0].suit)) return Result.Fail_InvalidOtherCards;
      const ranks = all.map((tile) => tile.rank).sort((a, b) => a - b);
      return ranks[0] + 1 === ranks[1] && ranks[1] + 1 === ranks[2] ? Result.Succ : Result.Fail_InvalidOtherCards;
    }
    return Result.Fail_ActionNotInCanQiangActions;
  }
  // ================= 轮到某家行动（手上 14 张） =================
  async awaitTurn(seat, drew, skipNotify) {
    if (this.handEnded) return;
    const p = this.players[seat];
    if (drew && this.isAiSeat(p) && this.canJiuZhongJiuPai(p)) {
      await this.abortiveDraw(LiuJuType.JiuZhongJiuPai, seat);
      return;
    }
    const can = this.turnActions(seat, drew);
    const cantPlays = this._nextCantPlays?.seat === seat ? this._nextCantPlays.values : [];
    this._nextCantPlays = null;
    if (!this._expectedDraw && this._bufferedDraw == null) this.expectDraw(seat, drew, can, cantPlays);
    if (drew && !skipNotify) {
      const newBao = this._pendingBaoPreCard || 0;
      this._pendingBaoPreCard = 0;
      this.emit(RiichiMsg.ENtfSendCard, {
        seat,
        baoPreCard: newBao,
        userInfos: this.players.map((q) => ({
          seat: q.seat,
          card: q.seat === seat && (q.isHuman || this.autoHuman) ? p.drawnTile : 0,
          tingInfos: q.seat === seat ? this.buildTingInfos(p) : [],
          canPlayActions: q.seat === seat ? can : [],
          leftTimer: q.isHuman ? Math.ceil(q.timeBank) : 0,
          isZhenTing: this.isFuriten(q),
          xunNum: this.xunNum,
          zhenTingTypes: this.furitenTypes(q)
        }))
      });
      await this._d(this.T.think);
    }
    let action, card;
    const useHumanInput = !this.isAiSeat(p) || this._bufferedDraw != null;
    if (useHumanInput) {
      if (!this._expectedDraw && this._bufferedDraw == null) this.expectDraw(seat, drew, can, cantPlays);
      this._processing = false; // 即将等待人类输入，允许缓存合法早到响应
      const payload = await this.waitHuman("draw");
      action = payload.action != null ? payload.action : PlayAction.Normal;
      card = payload.card != null ? payload.card : p.drawnTile;
    } else {
      this._expectedDraw = null;
      const d = this.aiTurn(seat, drew, can, cantPlays);
      action = d.action;
      card = d.card;
      await this._d(this.T.think);
    }
    const result = await this.processTurnAction(seat, action, card, drew, cantPlays);
    if (result !== Result.Succ) throw new Error(`非法内部动作 seat=${seat} action=${action} result=${result}`);
  }
  // 手牌 14 张时的可选动作
  turnActions(seat, drew) {
    const p = this.players[seat];
    const acts = [PlayAction.Normal];
    if (drew && this.canTsumo(p)) acts.push(PlayAction.Hu);
    if (drew && !p.riichi && p.menzen && this.canRiichi(p)) acts.push(PlayAction.Riichi);
    if (drew && this.kanCount < 4 && this.remain > 1) {
      if (this.concealedQuadTile(p) != null) acts.push(PlayAction.AnGang);
      if (!p.riichi && this.addedKanTile(p) != null) acts.push(PlayAction.PengGang);
    }
    if (drew && !this.isAiSeat(p) && this.canJiuZhongJiuPai(p)) acts.push(PlayAction.JiuZhongJiuLiuJu);
    if (drew && this.sanma && this.northInHand(p) != null && this.replacements.length && this.remain > 1) {
      acts.push(PlayAction.BaBei);
    }
    return acts;
  }
  // 手里的北（三麻拔北用），没有则返回 null
  northInHand(p) {
    if (p.riichi) {
      const tile = p.drawnTile;
      if (tile == null || !p.hand.includes(tile)) return null;
      const drawn = decodeId(tile);
      return drawn.suit === 4 && drawn.rank === 4 ? tile : null;
    }
    for (const t of p.hand) {
      const d = decodeId(t);
      if (d.suit === 4 && d.rank === 4) return t;
    }
    return null;
  }
  countYaoJiuKinds(p) {
    const s = /* @__PURE__ */ new Set();
    for (const t of p.hand) {
      const { suit, rank } = decodeId(t);
      if (suit === 4 || rank === 1 || rank === 9) s.add(suit * 10 + rank);
    }
    return s.size;
  }
  // 该席位是否由 AI 操作（autoHuman 为测试用：把 0 号真人席位也交给 AI 代打）
  isAiSeat(p) {
    return !p.isHuman || this.autoHuman;
  }
  // 九种九牌成立条件：仍在首巡（任何鸣牌——含吃碰杠与拔北——都会把 firstGoAround 置 false）
  // 且刚摸完牌的手牌里有 ≥9 种幺九。成立时人类可选、AI 自动。
  canJiuZhongJiuPai(p) {
    return this.firstGoAround && this.countYaoJiuKinds(p) >= 9;
  }
  canRiichi(p) {
    if (!p.menzen || p.riichi) return false;
    if (p.score < 1e3) return false;
    if (this.remain < this.playersN) return false;
    return this.formalTenpaiDiscards(p).length > 0;
  }
  canTsumo(p) {
    const w = calcWin(p.hand, p.melds, this.akaSet, this.winOpts(p, false));
    return w.isAgari && w.hasYaku;
  }
  concealedQuadTiles(p) {
    const counts = new Map();
    for (const tile of p.hand) counts.set(kindOf2(tile), (counts.get(kindOf2(tile)) || 0) + 1);
    const quads = [...counts.entries()]
      .filter(([, count]) => count === 4)
      .map(([kind]) => p.hand.find((tile) => kindOf2(tile) === kind));
    if (!p.riichi) return quads;
    if (p.drawnTile == null) return [];
    const drawnKind = kindOf2(p.drawnTile);
    return quads.filter((tile) => kindOf2(tile) === drawnKind && this.riichiAnkanKeepsWaits(p, drawnKind));
  }
  concealedQuadTile(p) {
    return this.concealedQuadTiles(p)[0] ?? null;
  }
  sameWaitKinds(left, right) {
    return left.length === right.length && left.every((kind, index) => kind === right[index]);
  }
  riichiAnkanKeepsWaits(p, quadKind) {
    const before = p.hand.slice();
    const drawnIndex = before.indexOf(p.drawnTile);
    if (drawnIndex < 0) return false;
    before.splice(drawnIndex, 1);
    const beforeWaits = handWaits(before, p.melds).waitKinds.slice().sort((a, b) => a - b);
    const after = p.hand.filter((tile) => kindOf2(tile) !== quadKind);
    const placeholder = p.hand.find((tile) => kindOf2(tile) === quadKind);
    const afterWaits = handWaits(after, p.melds.concat([{ type: "ankan", tiles: [placeholder, placeholder, placeholder, placeholder] }])).waitKinds.slice().sort((a, b) => a - b);
    return this.sameWaitKinds(beforeWaits, afterWaits);
  }
  riichiFutureAnkanKinds(p) {
    if (!p.riichi || p.hand.length % 3 !== 1) return [];
    const beforeWaits = handWaits(p.hand, p.melds).waitKinds.slice().sort((a, b) => a - b);
    const counts = new Map();
    for (const tile of p.hand) counts.set(kindOf2(tile), (counts.get(kindOf2(tile)) || 0) + 1);
    const result = [];
    for (const [kind, count] of counts) {
      if (count !== 3) continue;
      const after = p.hand.filter((tile) => kindOf2(tile) !== kind);
      const placeholder = p.hand.find((tile) => kindOf2(tile) === kind);
      const afterWaits = handWaits(after, p.melds.concat([{ type: "ankan", tiles: [placeholder, placeholder, placeholder, placeholder] }])).waitKinds.slice().sort((a, b) => a - b);
      if (this.sameWaitKinds(beforeWaits, afterWaits)) result.push(kind * 10);
    }
    return result;
  }
  // 加杠：手上有与已碰的刻子同种的牌
  addedKanTile(p) {
    for (const m of p.melds) {
      if (m.type !== "pon") continue;
      const k = kindOf2(m.tiles[0]);
      const t = p.hand.find((x) => kindOf2(x) === k);
      if (t != null) return t;
    }
    return null;
  }
  // 表宝牌的「牌种」集合（供 AI 保留宝牌用）
  doraKinds() {
    const s = /* @__PURE__ */ new Set();
    for (const ind of this.doraIndicators) s.add(kindOf2(doraFromIndicator(ind, this.sanma)));
    return s;
  }
  // 场上已公开的牌（牌河 + 副露 + 宝牌指示牌）
  visibleCounts() {
    const c = new Array(34).fill(0);
    const add = (id) => {
      const i = tileIndex(id);
      if (i >= 0) c[i]++;
    };
    for (const q of this.players) {
      for (const t of q.discards) add(t);
      for (const m of q.melds) for (const t of m.tiles) add(t);
    }
    for (const t of this.doraIndicators) add(t);
    return c;
  }
  // 某家视角下「某牌种还剩几张」（用于受入枚数）
  remainOfFor(p) {
    const vis = this.visibleCounts();
    const own = countsOf(p.hand);
    const total = (idx) => this.sanma && idx >= 1 && idx <= 7 ? 0 : 4;
    return (idx) => total(idx) - vis[idx] - own[idx];
  }
  // 统一的弃牌评估入口
  bestDiscard(p, extra = {}) {
    return chooseDiscard(p.hand, p.melds, {
      drawnTile: p.drawnTile,
      doraKinds: this.doraKinds(),
      akaSet: this.akaSet,
      remainOf: this.remainOfFor(p),
      ...extra
    });
  }
  doraTilesFor(p) {
    const out = this.doraIndicators.map((i) => doraFromIndicator(i, this.sanma));
    if (p.riichi) out.push(...this.uraIndicators.map((i) => doraFromIndicator(i, this.sanma)));
    return out;
  }
  winOpts(p, isRon, ronTile = null) {
    return {
      ronTile: isRon ? ronTile : null,
      riichi: p.riichi,
      doubleRiichi: p.doubleRiichi,
      ippatsu: p.riichi && p.ippatsu,
      tenho: !isRon && this.firstGoAround && p.discards.length === 0,
      rinshan: !isRon && p.rinshan,
      haidi: this.remain <= 0 && (isRon || !p.rinshan),
      doraTiles: this.doraTilesFor(p),
      roundWind: this.roundWind,
      seatWind: this.seatWindOf(p.seat)
    };
  }
  // 13 张形时更新听牌信息（waits 存牌种码）
  updateWaits(p) {
    if (p.hand.length % 3 !== 1) return;
    const info = handWaits(p.hand, p.melds);
    p.shanten = info.shanten;
    p.waits = info.shanten === 0 ? info.waitKinds : [];
    p.waitTiles = info.shanten === 0 ? info.waits : [];
  }
  isFormalTenpaiHand(hand, melds) {
    const info = handWaits(hand, melds);
    if (info.shanten !== 0 || !info.waitKinds.length) return false;
    if (info.waitKinds.length !== 1) return true;
    const waitKind = info.waitKinds[0];
    return hand.filter((tile) => kindOf2(tile) === waitKind).length < 4;
  }
  formalTenpaiDiscards(p) {
    if (p.hand.length % 3 !== 2) return [];
    const result = [];
    const seen = new Set();
    for (const tile of p.hand) {
      const kind = kindOf2(tile);
      if (seen.has(kind)) continue;
      seen.add(kind);
      const hand = p.hand.slice();
      hand.splice(hand.indexOf(tile), 1);
      if (this.isFormalTenpaiHand(hand, p.melds)) result.push(kind);
    }
    return result;
  }
  isTenpai(p) {
    if (p.hand.length % 3 === 1) return this.isFormalTenpaiHand(p.hand, p.melds);
    return this.formalTenpaiDiscards(p).length > 0;
  }
  selfFuriten(p) {
    return !!p.waits?.length && p.waits.some((kind) => p.discardKinds.has(kind));
  }
  isFuriten(p) {
    return this.selfFuriten(p) || !!p.tempFuriten || !!p.riichiFuriten;
  }
  furitenTypes(p) {
    const types = [];
    if (p.riichiFuriten) types.push(0);
    if (p.tempFuriten) types.push(1);
    if (this.selfFuriten(p)) types.push(2);
    return types;
  }
  markPassedRon(p) {
    if (p.riichi) p.riichiFuriten = true;
    else p.tempFuriten = true;
  }
  confirmRiichiDeclaration(p) {
    if (p?.riichiPending) p.riichiPending = false;
  }
  rollbackRiichiDeclaration(p) {
    if (!p?.riichiPending) return;
    p.riichi = false;
    p.doubleRiichi = false;
    p.riichiPending = false;
    p.riichiTurn = -1;
    p.ippatsu = false;
    p.score += 1e3;
    this.riichiSticks = Math.max(0, this.riichiSticks - 1);
  }
  // 14 张形的听牌提示：打哪张 -> 听哪些
  //
  // 编码陷阱：tingInfos.play / ting 用的是「牌种」编码（copy 位固定为 0），
  // 实机样本 play=380(3索) ting=210(1筒)、play=110(1万)，全部以 0 结尾。
  // 其余字段（handCards / NtfPlayCard.card / baoPreCard …）才是带 copy 的完整牌 ID。
  // 之前这里发的是 copy=1 的完整 ID（381/211），客户端按牌种查表匹配不上，
  // 结果就是「听了牌但不显示听牌、也没有听牌提示」。
  buildTingInfos(p) {
    if (p.hand.length % 3 !== 2) return [];
    const { shanten: sh, options } = discardOptionsOfCounts(
      countsOf(p.hand),
      realMelds(p.melds).length,
      this.remainOfFor(p)
    );
    if (sh !== 0) return [];
    const out = [];
    for (const o of options) {
      const playTile = p.hand.find((t) => tileIndex(t) === o.idx);
      if (!playTile) continue;
      const play = indexToTileId(o.idx, 0);
      const hand13 = p.hand.slice();
      hand13.splice(hand13.indexOf(playTile), 1);
      if (!this.isFormalTenpaiHand(hand13, p.melds)) continue;
      for (const wIdx of o.waits) {
        const tingTile = indexToTileId(wIdx, 0);
        const hand14 = hand13.concat([tingTile]);
        const wMo = calcWin(hand14, p.melds, this.akaSet, this.winOpts(p, false));
        const wRong = calcWin(hand13, p.melds, this.akaSet, this.winOpts(p, true, tingTile));
        out.push({
          play,
          ting: tingTile,
          hasYiWhenMo: wMo.hasYaku,
          yiManChance: 0,
          fanFuTypeWhenMo: 0,
          hasYiWhenRong: wRong.hasYaku,
          manType: 0
        });
      }
    }
    return out.slice(0, 60);
  }
  // ================= 处理行动 =================
  async processTurnAction(seat, action, card, drew, cantPlays = []) {
    const p = this.players[seat];
    const result = this.validateTurnPayload(
      { action, card },
      { seat, drew, actions: this.turnActions(seat, drew), cantPlays }
    );
    if (result !== Result.Succ) return result;

    this._processing = true;
    this._bufferedDraw = null;
    this._bufferedClaim = null;
    if (action === PlayAction.Hu) {
      await this.winTsumo(seat);
      return Result.Succ;
    }
    if (action === PlayAction.JiuZhongJiuLiuJu) {
      await this.abortiveDraw(LiuJuType.JiuZhongJiuPai, seat);
      return Result.Succ;
    }
    if (action === PlayAction.AnGang) {
      await this.doKan(seat, card, "ankan");
      return Result.Succ;
    }
    if (action === PlayAction.PengGang) {
      await this.doKan(seat, card, "kakan");
      return Result.Succ;
    }
    if (action === PlayAction.BaBei) {
      await this.doBaBei(seat, card);
      return Result.Succ;
    }
    if (action === PlayAction.Riichi) {
      p.riichi = true;
      p.doubleRiichi = this.firstGoAround && p.discards.length === 0;
      p.riichiTurn = this.xunNum;
      p.riichiPending = true;
      p.ippatsu = true;
      p.score -= 1e3;
      this.riichiSticks += 1;
    }
    const idx = p.hand.lastIndexOf(card);
    p.hand.splice(idx, 1);
    p.hand.sort((a, b) => a - b);
    p.discards.push(card);
    p.discardKinds.add(kindOf2(card));
    this.updateWaits(p);
    this.lastDiscard = { seat, card };
    if (p.ippatsu && p.riichiTurn !== this.xunNum) p.ippatsu = false;
    await this.discard(seat, card, action);
    return Result.Succ;
  }
  emptyClaims() {
    return this.players.map(() => []);
  }
  async discard(seat, card, action) {
    const p = this.players[seat];
    const isMoQie = p.drawnTile === card;
    p.drawnTile = null;
    p.rinshan = false;
    this.flushDeferredKanDora();
    const canQiang = this.players.map((q) => q.seat === seat ? [] : this.claimActions(q.seat, seat, card));
    this.expectClaim(0, seat, card, canQiang[0] || []);
    this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, card, action, isMoQie, canQiang));
    await this._d(this.T.claim);
    await this.resolveClaims(seat, card, canQiang);
  }
  checkSiFengLianDa() {
    if (!this.firstGoAround) return false;
    const n = this.playersN;
    if (n !== 4) return false;
    const firsts = this.players.map((p) => p.discards[0]);
    if (firsts.some((t) => t == null)) return false;
    if (this.players.some((p) => p.discards.length !== 1 || p.melds.length)) return false;
    const kinds = firsts.map(kindOf2);
    return kinds.every((k) => k >= 41 && k <= 44 && k === kinds[0]);
  }
  buildPlayCard(seat, card, action, isMoQie, canQiang) {
    return {
      seat,
      card,
      action,
      isMoQie,
      userInfos: this.players.map((q) => ({
        seat: q.seat,
        canQiangActions: canQiang[q.seat] || [],
        isZhenTing: this.isFuriten(q),
        leftTimer: q.isHuman ? Math.ceil(q.timeBank) : 0,
        canAnGangNoNumCardsAfterRiichi: this.riichiFutureAnkanKinds(q),
        zhenTingTypes: this.furitenTypes(q)
      }))
    };
  }
  // ================= 鸣牌 =================
  claimActions(seat, discarderSeat, card) {
    const p = this.players[seat];
    const acts = [];
    if (this.canRon(p, card)) acts.push(PlayAction.Hu);
    if (!p.riichi) {
      const cnt = p.hand.filter((t) => kindOf2(t) === kindOf2(card)).length;
      if (cnt >= 3 && this.kanCount < 4 && this.remain > 1) acts.push(PlayAction.MingGang);
      if (cnt >= 2 && this.remain > 0) acts.push(PlayAction.Peng);
      if (!this.sanma && seat === this.nextSeat(discarderSeat) && this.remain > 0) {
        if (this.chiTiles(p, card)) acts.push(PlayAction.Chi);
      }
    }
    if (acts.length) acts.push(PlayAction.Guo);
    return acts;
  }
  canRon(p, card, extra = {}) {
    if (!p.waits || !p.waits.includes(kindOf2(card))) return false;
    if (this.isFuriten(p)) return false;
    const w = calcWin(p.hand, p.melds, this.akaSet, { ...this.winOpts(p, true, card), ...extra });
    return w.isAgari && w.hasYaku;
  }
  chiOptions(p, card) {
    const { suit, rank } = decodeId(card);
    if (suit === 4) return [];
    const options = [];
    const combos = [[rank - 2, rank - 1], [rank - 1, rank + 1], [rank + 1, rank + 2]];
    for (const [leftRank, rightRank] of combos) {
      if (leftRank < 1 || leftRank > 9 || rightRank < 1 || rightRank > 9) continue;
      const left = p.hand.find((tile) => {
        const decoded = decodeId(tile);
        return decoded.suit === suit && decoded.rank === leftRank;
      });
      if (left == null) continue;
      const right = p.hand.find((tile) => {
        const decoded = decodeId(tile);
        return tile !== left && decoded.suit === suit && decoded.rank === rightRank;
      });
      if (right != null) options.push([left, right]);
    }
    return options;
  }
  chiTiles(p, card) {
    return this.chiOptions(p, card)[0] || null;
  }
  async resolveClaims(discarderSeat, card, canQiang) {
    const all = [];
    let humanHandled = false;
    const humanCanClaim = this.players[0].isHuman && canQiang[0]?.length;
    if (humanCanClaim && (!this.isAiSeat(this.players[0]) || this._bufferedClaim != null)) {
      if (!this._expectedClaim && this._bufferedClaim == null) this.expectClaim(0, discarderSeat, card, canQiang[0]);
      const payload = await this.waitHuman("claim");
      humanHandled = true;
      if (payload?.action != null && payload.action !== PlayAction.Guo) {
        all.push({ seat: 0, action: payload.action, otherCards: payload.otherCards || [] });
      } else if (canQiang[0].includes(PlayAction.Hu)) {
        this.markPassedRon(this.players[0]);
      }
    } else {
      this._expectedClaim = null;
    }
    for (let seat = 0; seat < this.playersN; seat++) {
      if (seat === 0 && (humanHandled || !this.isAiSeat(this.players[0]))) continue;
      if (!canQiang[seat]?.length) continue;
      const claim = this.aiClaim(seat, discarderSeat, card, canQiang[seat]);
      if (claim) all.push({ seat, ...claim });
      else if (canQiang[seat].includes(PlayAction.Hu)) this.markPassedRon(this.players[seat]);
    }
    if (!all.length) {
      this.confirmRiichiDeclaration(this.players[discarderSeat]);
      if (this.playersN === 4 && this.players.every((player) => player.riichi)) {
        await this.abortiveDraw(LiuJuType.SiJiaLiZhi, discarderSeat);
        return;
      }
      if (this.checkSiFengLianDa()) {
        await this.abortiveDraw(LiuJuType.SiFengLianDa, discarderSeat);
        return;
      }
      const next = this.nextSeat(discarderSeat);
      if (next === this.dealerSeat) this.firstGoAround = false;
      await this.turnDraw(next);
      return;
    }
    const priority = (claim) => claim.action === PlayAction.Hu ? 4 : claim.action === PlayAction.MingGang ? 3 : claim.action === PlayAction.Peng ? 2 : 1;
    const distance = (seat) => (seat - discarderSeat + this.playersN) % this.playersN;
    all.sort((left, right) => priority(right) - priority(left) || distance(left.seat) - distance(right.seat));
    const ronClaims = all.filter((claim) => claim.action === PlayAction.Hu);
    if (ronClaims.length) {
      await this.winRons(ronClaims.map((claim) => claim.seat), discarderSeat, card);
      return;
    }
    this.confirmRiichiDeclaration(this.players[discarderSeat]);
    const claim = all[0];
    await this.executeClaim(claim.seat, claim.action, card, discarderSeat, claim.otherCards || []);
  }
  recordPao(player, discarderSeat) {
    player.pao ||= {};
    const tripletKinds = new Set(player.melds
      .filter((meld) => meld.type === "pon" || meld.type === "kan")
      .map((meld) => kindOf2(meld.tiles[0])));
    if (player.pao.daisangen == null && [45, 46, 47].every((kind) => tripletKinds.has(kind))) {
      player.pao.daisangen = discarderSeat;
    }
    if (player.pao.daisuushi == null && [41, 42, 43, 44].every((kind) => tripletKinds.has(kind))) {
      player.pao.daisuushi = discarderSeat;
    }
  }
  paoYakumanUnits(player, win) {
    const yaku = win.yaku || {};
    let units = 0;
    if (player.pao?.daisangen != null && Object.keys(yaku).some((name) => name.includes("大三元"))) units += 1;
    if (player.pao?.daisuushi != null && Object.keys(yaku).some((name) => name.includes("大四喜"))) units += 2;
    return Math.min(units, win.yakuman || units);
  }
  paoSeatFor(player, win) {
    const names = Object.keys(win.yaku || {});
    if (player.pao?.daisangen != null && names.some((name) => name.includes("大三元"))) return player.pao.daisangen;
    if (player.pao?.daisuushi != null && names.some((name) => name.includes("大四喜"))) return player.pao.daisuushi;
    return null;
  }
  async executeClaim(seat, action, card, discarderSeat, otherCards) {
    const p = this.players[seat];
    const validation = this.validateClaimPayload(
      { action, otherCards },
      { seat, discarderSeat, card, actions: this.claimActions(seat, discarderSeat, card) }
    );
    if (validation !== Result.Succ) return validation;
    this._processing = true; // 鸣牌执行中：此期间到达的包视为重复包丢弃
    this._bufferedDraw = null; this._bufferedClaim = null; // 清空上一动作的残留缓冲（防重复包重放）
    const donor = this.players[discarderSeat];
    if (action === PlayAction.Hu) {
      await this.winRon(seat, discarderSeat, card);
      return Result.Succ;
    }
    donor.discards.pop();
    donor.discardClaimed = true;
    for (const q of this.players) q.ippatsu = false;
    this.firstGoAround = false;
    if (action === PlayAction.MingGang) {
      const used2 = this.takeTiles(p, card, 3);
      p.melds.push({ type: "kan", tiles: [...used2, card], from: discarderSeat });
      p.menzen = false;
      this.kanCount++;
      this.recordPao(p, discarderSeat);
      this.emit(RiichiMsg.ENtfQiangCard, this.buildQiang(seat, action, used2));
      await this._d(this.T.claim);
      this._deferredKanDora++;
      if (this.kanCount >= 4 && !this.players.some((player) => player.melds.filter((meld) => meld.type === "kan" || meld.type === "ankan").length >= 4)) {
        await this.abortiveDraw(LiuJuType.SiGang, seat);
        return Result.Succ;
      }
      if (!await this.drawReplacement(seat)) return Result.Succ;
      this.emit(RiichiMsg.ENtfQiangCardEnd, this.buildQiangEnd(seat, action, used2, [...used2, card]));
      await this._d(this.T.claim);
      await this.awaitTurn(seat, true);
      return Result.Succ;
    }
    const isChi = action === PlayAction.Chi;
    const used = otherCards.slice();
    for (const tile of used) {
      p.hand.splice(p.hand.indexOf(tile), 1);
    }
    const meldTiles = [...used, card].sort((a, b) => a - b);
    p.melds.push({ type: isChi ? "chi" : "pon", tiles: meldTiles, from: discarderSeat });
    if (!isChi) this.recordPao(p, discarderSeat);
    p.menzen = false;
    p.drawnTile = null;
    p.rinshan = false;
    const cantPlays = this.cantPlays(p, action, meldTiles);
    this._nextCantPlays = { seat, values: cantPlays };
    this.emit(RiichiMsg.ENtfQiangCard, this.buildQiang(seat, action, used));
    await this._d(this.T.claim);
    this.expectDraw(seat, false, this.turnActions(seat, false), cantPlays);
    this.emit(RiichiMsg.ENtfQiangCardEnd, this.buildQiangEnd(seat, action, used, meldTiles));
    await this._d(this.T.claim);
    await this.awaitTurn(seat, false);
    return Result.Succ;
  }
  canRobKan(p, tile, kind) {
    if (!p.waits?.includes(kindOf2(tile)) || this.isFuriten(p)) return false;
    const win = calcWin(p.hand, p.melds, this.akaSet, { ...this.winOpts(p, true, tile), chankan: true });
    if (!win.isAgari || !win.hasYaku) return false;
    if (kind !== "ankan") return true;
    return Object.keys(win.yaku || {}).some((name) => name.includes("国士無双"));
  }
  kanRobActions(kanSeat, tile, kind) {
    return this.players.map((player) => {
      if (player.seat === kanSeat || !this.canRobKan(player, tile, kind)) return [];
      return [PlayAction.Hu, PlayAction.Guo];
    });
  }
  async resolveKanRob(kanSeat, tile, canQiang, winExtra = { chankan: true }) {
    const claims = [];
    let humanHandled = false;
    const humanCanClaim = this.players[0].isHuman && canQiang[0]?.length;
    if (humanCanClaim && (!this.isAiSeat(this.players[0]) || this._bufferedClaim != null)) {
      if (!this._expectedClaim && this._bufferedClaim == null) this.expectClaim(0, kanSeat, tile, canQiang[0]);
      const payload = await this.waitHuman("claim");
      humanHandled = true;
      if (payload?.action === PlayAction.Hu) claims.push({ seat: 0 });
      else this.markPassedRon(this.players[0]);
    } else {
      this._expectedClaim = null;
    }
    for (let seat = 0; seat < this.playersN; seat++) {
      if (seat === 0 && (humanHandled || !this.isAiSeat(this.players[0]))) continue;
      if (canQiang[seat]?.includes(PlayAction.Hu)) claims.push({ seat });
    }
    if (!claims.length) return false;
    const distance = (seat) => (seat - kanSeat + this.playersN) % this.playersN;
    claims.sort((left, right) => distance(left.seat) - distance(right.seat));
    await this.winRons(claims.map((claim) => claim.seat), kanSeat, tile, winExtra);
    return true;
  }
  async doKan(seat, card, kind) {
    this.flushDeferredKanDora();
    const p = this.players[seat];
    const action = kind === "ankan" ? PlayAction.AnGang : PlayAction.PengGang;
    const canQiang = this.kanRobActions(seat, card, kind);
    this.expectClaim(0, seat, card, canQiang[0] || []);
    this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, card, action, false, canQiang));
    await this._d(this.T.claim);
    if (await this.resolveKanRob(seat, card, canQiang)) return;

    if (kind === "ankan") {
      const tiles = this.takeTilesByKind(p, kindOf2(card), 4);
      p.melds.push({ type: "ankan", tiles });
    } else {
      const meld = p.melds.find((item) => item.type === "pon" && kindOf2(item.tiles[0]) === kindOf2(card));
      p.hand.splice(p.hand.indexOf(card), 1);
      meld.type = "kan";
      meld.tiles = [...meld.tiles, card];
    }
    this.kanCount++;
    for (const player of this.players) player.ippatsu = false;
    this.firstGoAround = false;
    if (kind === "ankan") this.revealKanDora();
    else this._deferredKanDora++;
    if (this.kanCount >= 4 && !this.players.some((player) => player.melds.filter((meld) => meld.type === "kan" || meld.type === "ankan").length >= 4)) {
      await this.abortiveDraw(LiuJuType.SiGang, seat);
      return;
    }
    if (!await this.drawReplacement(seat)) return;
    await this.awaitTurn(seat, true);
  }
  flushDeferredKanDora() {
    while (this._deferredKanDora > 0) {
      this._deferredKanDora--;
      this.revealKanDora();
    }
  }
  revealKanDora() {
    const i = this.doraIndicators.length;
    const baoBase = this.sanma ? 8 : 4;
    // 三麻/四麻宝牌指示牌均5张（initial + 4 kan dora），布局一致，仅起始偏移不同（三麻8/四麻4）
    const maxI = 4;
    if (i >= 1 && i <= maxI && this.deadWall[baoBase + 2 * i] != null) {
      const ind = this.deadWall[baoBase + 2 * i];
      this.doraIndicators.push(ind);
      this.uraIndicators.push(this.deadWall[baoBase + 1 + 2 * i]);
      this._pendingBaoPreCard = ind;
    }
  }
  takeTiles(p, card, n) {
    return this.takeTilesByKind(p, kindOf2(card), n);
  }
  takeTilesByKind(p, kind, n) {
    const used = [];
    for (let i = 0; i < n; i++) {
      const idx = p.hand.findIndex((t) => kindOf2(t) === kind);
      if (idx >= 0) used.push(p.hand.splice(idx, 1)[0]);
    }
    return used;
  }
  // otherCards 是「自己手里贡献的牌」，**不含**被鸣的那张（实机抓包：
  // Chi/Peng 均为 2 张、MingGang 为 3 张，被鸣牌只由 NtfPlayCard.card 给出）。
  // 若把被鸣牌也塞进来，客户端会按 otherCards.length+1 判定副露类型：
  // 碰(3)→显示成明杠、吃(3)→UI 拼不出顺子而卡死。
  buildQiang(seat, action, otherCards) {
    return {
      seat,
      action,
      otherCards: otherCards || [],
      userInfos: this.players.map((q) => ({ seat: q.seat }))
    };
  }
  // otherCards = 发给客户端的「自己手里贡献的牌」（不含被鸣的那张）
  // meldTiles   = 完整面子（含被鸣牌），仅内部用于算食替禁止牌
  buildQiangEnd(seat, action, otherCards, meldTiles) {
    const p = this.players[seat];
    return {
      seats: [seat],
      action,
      otherCards: otherCards || [],
      userInfos: this.players.map((q) => ({
        seat: q.seat,
        tingInfos: q.seat === seat ? this.buildTingInfos(p) : [],
        // 实机 NtfQiangCardEnd 的 canPlayActions 只能是 []（他家）或 [0]（鸣牌者，
        // 即「仅可打牌」），绝不带 6/7/8/9/10。完整可选项由紧随其后的 NtfSendCard 下发。
        canPlayActions: q.seat === seat ? [PlayAction.Normal] : [],
        isZhenTing: this.isFuriten(q),
        cantPlays: q.seat === seat ? this.cantPlays(p, action, meldTiles || otherCards || []) : [],
        leftTimer: q.isHuman ? Math.ceil(q.timeBank) : 0,
        xunNum: this.xunNum,
        zhenTingTypes: this.furitenTypes(q)
      }))
    };
  }
  // 吃碰后的食替禁止牌（同样是牌种编码 copy=0，实机样本 [440,310,280,380,320]）
  cantPlays(p, action, meldTiles) {
    if (action !== PlayAction.Chi && action !== PlayAction.Peng) return [];
    const claimed = this.lastDiscard ? this.lastDiscard.card : null;
    return [...this.kuikaeKinds(action, meldTiles, claimed)]
      .filter((kind) => p.hand.some((tile) => kindOf2(tile) === kind))
      .map((kind) => kind * 10);
  }
  kuikaeKinds(action, meldTiles, claimed) {
    const out = new Set();
    if (claimed == null || (action !== PlayAction.Chi && action !== PlayAction.Peng)) return out;
    out.add(kindOf2(claimed));
    if (action !== PlayAction.Chi || meldTiles.length !== 3) return out;
    const claimedTile = decodeId(claimed);
    const ranks = meldTiles.map((tile) => decodeId(tile).rank).sort((left, right) => left - right);
    if (ranks[2] - ranks[0] !== 2) return out;
    if (claimedTile.rank === ranks[0] && ranks[2] < 9) out.add(claimedTile.suit * 10 + ranks[2] + 1);
    if (claimedTile.rank === ranks[2] && ranks[0] > 1) out.add(claimedTile.suit * 10 + ranks[0] - 1);
    return out;
  }
  // ================= 和牌 / 流局 =================
  async winTsumo(seat) {
    const p = this.players[seat];
    const w = calcWin(p.hand, p.melds, this.akaSet, this.winOpts(p, false));
    await this.endHand({ type: "tsumo", winner: seat, loser: null, card: p.drawnTile, win: w });
  }
  async winRon(seat, loser, card, extra = {}) {
    await this.winRons([seat], loser, card, extra);
  }
  async winRons(seats, loser, card, extra = {}) {
    this.rollbackRiichiDeclaration(this.players[loser]);
    const wins = new Map();
    for (const seat of seats) {
      const p = this.players[seat];
      const win = calcWin(
        p.hand,
        p.melds,
        this.akaSet,
        { ...this.winOpts(p, true, card), ...extra }
      );
      if (!win.isAgari || !win.hasYaku) throw new Error(`非法荣和 seat=${seat}`);
      wins.set(seat, win);
    }
    await this.endHand({ type: "ron", winners: seats.slice(), loser, card, wins });
  }
  async exhaustiveDraw() {
    const nagashiWinners = this.players
      .filter((player) => player.discards.length > 0 && !player.discardClaimed && player.discards.every((tile) => {
        const { suit, rank } = decodeId(tile);
        return suit === 4 || rank === 1 || rank === 9;
      }))
      .map((player) => player.seat);
    const tenpai = this.players.map((player) => this.isTenpai(player));
    await this.endHand({ type: "draw", liuJuType: LiuJuType.HuangPai, tenpai, nagashiWinners });
  }
  async abortiveDraw(liuJuType, seat) {
    await this.endHand({
      type: "draw",
      liuJuType,
      liuJuSeat: seat,
      tenpai: this.players.map(() => false),
      noPenalty: true
    });
  }
  // ================= 结算 =================
  async endHand(res) {
    if (this.handEnded) return;
    this.handEnded = true;
    const n = this.playersN;
    const scores = this.players.map((p) => p.score);
    let dealerContinues = false;
    let ui = [];
    if (res.type === "draw") {
      const nagashiWinners = res.nagashiWinners || [];
      if (nagashiWinners.length) {
        for (const winner of nagashiWinners) {
          const dealerWin = winner === this.dealerSeat;
          for (let seat = 0; seat < n; seat++) {
            if (seat === winner) continue;
            const payment = dealerWin || seat === this.dealerSeat ? 4_000 : 2_000;
            scores[seat] -= payment;
            scores[winner] += payment;
          }
        }
      } else if (!res.noPenalty) {
        const tenpaiSeats = res.tenpai.map((tenpai, seat) => tenpai ? seat : -1).filter((seat) => seat >= 0);
        const notenSeats = res.tenpai.map((tenpai, seat) => tenpai ? -1 : seat).filter((seat) => seat >= 0);
        if (tenpaiSeats.length && notenSeats.length) {
          const receive = Math.floor(3_000 / tenpaiSeats.length);
          const payment = Math.floor(3_000 / notenSeats.length);
          for (const seat of tenpaiSeats) scores[seat] += receive;
          for (const seat of notenSeats) scores[seat] -= payment;
        }
      }
      dealerContinues = res.noPenalty ? true : !!res.tenpai[this.dealerSeat];
      const gameOver2 = this.decideGameOver(dealerContinues, scores, { drawNoPenalty: !!res.noPenalty });
      this.renchanCount = dealerContinues ? this.renchanCount + 1 : 0;
      if (gameOver2 && this.riichiSticks > 0) {
        const topSeat = this.players.map((_, seat) => seat).sort((left, right) => scores[right] - scores[left] || left - right)[0];
        scores[topSeat] += this.riichiSticks * 1e3;
        this.riichiSticks = 0;
      }
      this.recordHumanHandStats(res, null, dealerContinues);
      this.prepareFinalResult(scores, gameOver2);
      ui = this.buildStopUserInfos(scores, null, null, res.tenpai, gameOver2);
      this.emit(RiichiMsg.ENtfGameStop, {
        huSeats: [],
        huCardSeat: -1,
        huCard: 0,
        liBaoPreCards: [],
        isFinal: gameOver2,
        userInfos: ui,
        baoPreCards: this.doraIndicators.slice(),
        liuJuManGuanSeats: nagashiWinners,
        liuJuType: res.liuJuType,
        liuJuSeat: res.liuJuSeat != null ? res.liuJuSeat : -1,
        duiCards: [],
        duiCardsStr: "",
        duiCardsStrSalt: "",
        stopType: 0,
        winningStreak: 0
      });
      await this.finishHand(gameOver2, dealerContinues, scores, { draw: true });
      return;
    }
    const winners = res.type === "tsumo" ? [res.winner] : res.winners.slice();
    const details = new Map();
    const huDelta = new Array(n).fill(0);
    for (let winnerIndex = 0; winnerIndex < winners.length; winnerIndex++) {
      const winner = winners[winnerIndex];
      const winP = this.players[winner];
      const isDealerWin = winner === this.dealerSeat;
      const doraBreak = this.countDora(winP, res.type === "ron" ? res.card : null);
      const extraFan = doraBreak.babei + doraBreak.babeiAsDora;
      const rawWin = res.type === "tsumo" ? res.win : res.wins.get(winner);
      const paoSeat = this.paoSeatFor(winP, rawWin);
      const paoUnits = this.paoYakumanUnits(winP, rawWin);
      const paoTotal = paoUnits * (isDealerWin ? 48_000 : 32_000);
      const win = this.applyExtraFan(rawWin, extraFan, isDealerWin);
      if (res.type === "tsumo") {
        let pureGain = 0;
        for (let seat = 0; seat < n; seat++) {
          if (seat === winner) continue;
          const base = isDealerWin ? win.oya[0] || 0 : seat === this.dealerSeat ? win.ko[0] || 0 : win.ko[1] || 0;
          const payment = base + this.honba * 100;
          scores[seat] -= payment;
          scores[winner] += payment;
          huDelta[seat] -= base;
          pureGain += base;
        }
        if (paoSeat != null && paoTotal > 0) {
          for (let seat = 0; seat < n; seat++) {
            if (seat === winner) continue;
            const paoShare = (isDealerWin || seat === this.dealerSeat ? 16_000 : 8_000) * paoUnits;
            // 包牌时本场全部由责任者承担，非包役满部分仍正常结算。
            scores[seat] += paoShare + this.honba * 100;
            scores[winner] -= paoShare + this.honba * 100;
            huDelta[seat] += paoShare;
            pureGain -= paoShare;
          }
          const paoPayment = paoTotal + (n - 1) * this.honba * 100;
          scores[paoSeat] -= paoPayment;
          scores[winner] += paoPayment;
          huDelta[paoSeat] -= paoTotal;
          pureGain += paoTotal;
        }
        huDelta[winner] += pureGain;
      } else {
        const base = win.ten || 0;
        const honbaPayment = winnerIndex === 0 ? this.honba * 300 : 0;
        scores[res.loser] -= base + honbaPayment;
        scores[winner] += base + honbaPayment;
        huDelta[res.loser] -= base;
        huDelta[winner] += base;
        if (paoSeat != null && paoSeat !== res.loser && paoTotal > 0) {
          const split = paoTotal / 2;
          scores[res.loser] += split + honbaPayment;
          scores[paoSeat] -= split + honbaPayment;
          huDelta[res.loser] += split;
          huDelta[paoSeat] -= split;
        }
      }
      const yakuInfo = mapYaku(win.yaku, {
        roundWind: this.roundWind,
        seatWind: this.seatWindOf(winner)
      });
      details.set(winner, {
        yiFans: this.rebuildYiFans(yakuInfo.yiFans),
        isYiMan: yakuInfo.isYiMan || win.yakuman > 0,
        manType: manTypeFromResult({ han: win.han, fu: win.fu, yakuman: win.yakuman, name: win.name }),
        baoFan: doraBreak.omote,
        liBaoFan: doraBreak.ura,
        redBaoFan: doraBreak.aka,
        baBeiFan: doraBreak.babei,
        fu: win.fu,
        totalFan: win.han
      });
    }
    const stickBonus = this.riichiSticks * 1e3;
    if (stickBonus) scores[winners[0]] += stickBonus;
    this.riichiSticks = 0;
    dealerContinues = winners.includes(this.dealerSeat);
    const gameOver = this.decideGameOver(dealerContinues, scores, {
      multiRonDealerContinuation: res.type === "ron" && winners.length > 1 && dealerContinues
    });
    this.renchanCount = dealerContinues ? this.renchanCount + 1 : 0;
    this.recordHumanHandStats(res, huDelta, dealerContinues);
    this.prepareFinalResult(scores, gameOver);
    ui = this.buildStopUserInfos(scores, winners, details, null, gameOver, huDelta);
    this.emit(RiichiMsg.ENtfGameStop, {
      huSeats: winners,
      huCardSeat: res.type === "ron" ? res.loser : winners[0],
      huCard: res.card || 0,
      liBaoPreCards: winners.some((seat) => this.players[seat].riichi) ? this.uraIndicators.slice() : [],
      isFinal: gameOver,
      userInfos: ui,
      baoPreCards: this.doraIndicators.slice(),
      liuJuManGuanSeats: [],
      liuJuType: 0,
      liuJuSeat: -1,
      duiCards: [],
      duiCardsStr: "",
      duiCardsStrSalt: "",
      stopType: 0,
      winningStreak: 0
    });
    await this.finishHand(gameOver, dealerContinues, scores);
  }
  // 给 riichi 库的结果补上库里没有的番数（目前只有拔北），并按标准公式重算点数。
  // 役满不受宝牌影响，原样返回。
  applyExtraFan(w, extraFan, isDealerWin) {
    if (!extraFan || !w || !w.isAgari || w.yakuman > 0) return w;
    const han = (w.han || 0) + extraFan;
    const fu = w.fu || 20;
    let base2;
    if (han >= 13) base2 = 8e3;
    else if (han >= 11) base2 = 6e3;
    else if (han >= 8) base2 = 4e3;
    else if (han >= 6) base2 = 3e3;
    else if (han === 5) base2 = 2e3;
    else base2 = Math.min(fu * 2 ** (2 + han), 2e3);
    const c = (x) => Math.ceil(x / 100) * 100;
    return {
      ...w,
      han,
      ten: c(base2 * (isDealerWin ? 6 : 4)),
      oya: [c(base2 * 2)],
      // 庄家自摸：每家付 base×2
      ko: [c(base2 * 2), c(base2)]
      // 闲家自摸：庄家付 base×2，其他闲家付 base
    };
  }
  // 宝牌拆分统计（表 / 里 / 赤 / 拔北）
  countDora(p, ronTile) {
    const tiles = p.hand.concat(ronTile != null ? [ronTile] : []);
    for (const m of p.melds) if (m.type !== "babei") tiles.push(...m.tiles);
    const babeiTiles = [];
    for (const m of p.melds) if (m.type === "babei") babeiTiles.push(...m.tiles);
    const count = (indList, list) => {
      let n = 0;
      for (const ind of indList) {
        const k = kindOf2(doraFromIndicator(ind, this.sanma));
        n += list.filter((t) => kindOf2(t) === k).length;
      }
      return n;
    };
    const babeiAsDora = count(this.doraIndicators, babeiTiles) + (p.riichi ? count(this.uraIndicators, babeiTiles) : 0);
    return {
      omote: count(this.doraIndicators, tiles) + count(this.doraIndicators, babeiTiles),
      ura: p.riichi ? count(this.uraIndicators, tiles) + count(this.uraIndicators, babeiTiles) : 0,
      aka: tiles.filter((t) => this.akaSet.has(t)).length,
      babei: babeiTiles.length,
      babeiAsDora
    };
  }
  // 剔除库合并出来的「ドラ」条目。
  //
  // 实机 15/15 例证明：宝牌**不进** yiFans，只走 baoFan / liBaoFan / redBaoFan / baBeiFan
  // 四个专用字段，且 totalFan = Σ(yiFans.fan) + 四项宝牌之和。
  // 之前这里把宝牌又 push 回 yiFans，客户端结算界面按
  // 「役列表 + 宝牌行」渲染时宝牌被算了两遍。
  rebuildYiFans(yiFans) {
    return yiFans.filter((y) => y.yiType !== YiType.Bao && y.yiType !== YiType.RedBao && y.yiType !== YiType.LiBao && y.yiType !== YiType.BaBeiBao);
  }
  recordHumanHandStats(result, huDelta, dealerContinues) {
    const stats = this.matchStats;
    const human = this.players[0];
    stats.hands += 1;
    if (human.riichi) stats.riichi += 1;
    if (human.melds.some((meld) => meld.type === "chi" || meld.type === "pon" || meld.type === "kan")) stats.calls += 1;
    const winners = result.type === "tsumo" ? [result.winner] : result.type === "ron" ? result.winners : [];
    if (winners.includes(0)) {
      stats.wins += 1;
      stats[result.type] += 1;
      stats.winPoints += Math.max(0, huDelta?.[0] || 0);
      stats.winTurns += this.xunNum;
    }
    if (result.type === "ron" && result.loser === 0) stats.dealIns += 1;
    if (dealerContinues && this.dealerSeat === 0) stats.maxRenchan = Math.max(stats.maxRenchan, this.renchanCount);
  }

  prepareFinalResult(scores, isFinal) {
    if (!isFinal || this._finalResult || !this.onFinalResult) return;
    this._finalResult = this.onFinalResult(scores.slice(), this) || null;
  }

  buildStopUserInfos(scores, winner, detail, tenpai, isFinal, huDelta) {
    const out = [];
    const order = this.players.map((_, seat) => seat).sort((left, right) => scores[right] - scores[left] || left - right);
    const rankOf = [];
    order.forEach((seat, index) => {
      rankOf[seat] = index + 1;
    });
    const winnerSeats = new Set(Array.isArray(winner) ? winner : winner == null ? [] : [winner]);
    const uma = this.playersN === 3 ? [15, 0, -15] : [15, 5, -5, -15];
    for (let s = 0; s < this.playersN; s++) {
      const p = this.players[s];
      const isWinner = winnerSeats.has(s);
      const currentDetail = detail instanceof Map ? detail.get(s) : isWinner ? detail : null;
      const rankResult = isFinal && s === 0 ? this._finalResult?.rank : null;
    const change = huDelta ? huDelta[s] || 0 : 0;
    // changeScore = 本手净分差（含立直棒/本场棒，与实机一致）；
    // yiFanChangeDian = 纯番符打点（不含立直棒/本场棒，之前的需求）。
    // handStart 取上一手结束时的累计分(this.scores)，首手则用 startScore。
    const handStart = this.scores ? this.scores[s] : this.startScore;
    const netDelta = scores[s] - handStart;
    const rank = rankOf[s];
      const jing = isFinal ? (scores[s] - this.startScore) / 1e3 + uma[rank - 1] : 0;
      out.push({
        seat: s,
        score: scores[s],
        handCards: p.hand.slice(),
        changeScore: netDelta,
        yiFans: currentDetail?.yiFans || [],
        baoFan: currentDetail?.baoFan || 0,
        liBaoFan: currentDetail?.liBaoFan || 0,
        redBaoFan: currentDetail?.redBaoFan || 0,
        fu: currentDetail?.fu || 0,
        totalFan: currentDetail?.totalFan || 0,
        isYiMan: currentDetail?.isYiMan || false,
        manType: currentDetail?.manType || 0,
        baBeiFan: currentDetail?.baBeiFan || 0,
        doorCardsInfos: p.melds.filter((m) => m.type !== "babei").map((m) => ({
          cards: m.tiles.slice(),
          action: m.type === "chi" ? PlayAction.Chi : m.type === "pon" ? PlayAction.Peng : m.type === "ankan" ? PlayAction.AnGang : PlayAction.MingGang,
          qiangSeat: m.from != null ? m.from : s
        })),
        // tings 同样是牌种编码（copy=0）：实机流局样本 [230]/[260,230]/[160,130]
        tings: tenpai ? tenpai[s] ? (p.waits || []).map((k) => k * 10) : [] : [],
        alreadyRiichi: p.riichi,
        baBeiCards: p.melds.filter((m) => m.type === "babei").map((m) => m.tiles[0]),
        rank,
        // 因和牌役番产生的纯打点（只含番符，不含本场棒/立直棒/听牌罚符）。
        yiFanChangeDian: change,
        jingSuanScore: jing,
        jieBi: Math.round(jing * 100),
        changePT: rankResult?.change || 0,
        isBaoPai: false,
        matchingScore: 0,
        isMatchingAward: false,
        lianZhuang: this.honba,
        maxFan: currentDetail?.totalFan || 0,
        realJieBi: 0,
        finalBi: 0,
        level: 0,
        loveValue: 0,
        oldLevel: 0,
        oldLoveValue: 0,
        ptLevel: rankResult?.level || 0,
        ptPoint: rankResult?.point || 0,
        oldPTLevel: rankResult?.oldLevel || 0,
        oldPTPoint: rankResult?.oldPoint || 0,
        itemRewardLevel: 0,
        itemRewards: []
      });
    }
    return out;
  }
  decideGameOver(dealerContinues, scores, { drawNoPenalty = false, multiRonDealerContinuation = false } = {}) {
    if (scores.some((score) => score < 0)) return true;
    if (this.handIndex + 1 >= this.maxHands) return true;
    if (drawNoPenalty) return false;

    const necessary = this.playersN === 3 ? 40_000 : 30_000;
    const order = this.players.map((_, seat) => seat).sort((left, right) => scores[right] - scores[left] || left - right);
    const topSeat = order[0];
    const topMeets = scores[topSeat] >= necessary;
    const lastSeat = this.juNum === this.playersN - 1;

    if (this.roundWind < this.regularWinds || this.roundWind === this.regularWinds && !lastSeat) return false;
    if (this.roundWind === this.regularWinds) {
      if (dealerContinues) return topSeat === this.dealerSeat && topMeets;
      return topMeets;
    }

    if (multiRonDealerContinuation) return false;
    if (topMeets) return true;
    return lastSeat && !dealerContinues;
  }
  async finishHand(gameOver, dealerContinues, scores, { draw = false } = {}) {
    this.scores = scores.slice();
    this.handIndex += 1;
    if (draw || dealerContinues) {
      this.honba += 1;
    } else {
      this.honba = 0;
    }
    if (!dealerContinues) {
      this.juNum += 1;
      this.dealerSeat = this.nextSeat(this.dealerSeat);
      if (this.juNum >= this.playersN) {
        this.juNum = 0;
        this.roundWind += 1;
      }
    }
    if (gameOver) {
      this.matchOver = true;
      this.finished = true;
      return;
    }
    await this._d(this.T.hand);
  }
  /** 重置为一局全新东风战（分数归位、局号/本场/庄家清零）。
   *  注意：终局【不】走这里——真实服终局后引擎就停了，新一场是重新匹配出来的新房间、
   *  由 20403 链路 new 一个 GameEngine（见 finishHand 的注释）。此方法仅留给外部复用。 */
  resetMatch() {
    this.scores = new Array(this.playersN).fill(this.startScore);
    this.handIndex = 0;
    this.juNum = 0;
    this.roundWind = 1;
    this.honba = 0;
    this.renchanCount = 0;
    this.dealerSeat = 0;
  }
  // ================= AI =================
  aiTurn(seat, drew, can, cantPlays = []) {
    const p = this.players[seat];
    if (can.includes(PlayAction.Hu)) return { action: PlayAction.Hu, card: p.drawnTile };
    const danger = this.dangerKinds(seat);
    if (can.includes(PlayAction.BaBei)) {
      const north = this.northInHand(p);
      if (north != null) return { action: PlayAction.BaBei, card: north };
    }
    if (can.includes(PlayAction.Riichi)) {
      const decision = this.riichiDecision(p, danger);
      if (decision) return decision;
    }
    if (can.includes(PlayAction.AnGang) && this.aiWantsKan(p, danger)) {
      return { action: PlayAction.AnGang, card: this.concealedQuadTile(p) };
    }
    if (can.includes(PlayAction.PengGang) && this.aiWantsKan(p, danger)) {
      return { action: PlayAction.PengGang, card: this.addedKanTile(p) };
    }
    const currentShanten = this.currentShanten(p);
    const fold = this.aiShouldFold(p, currentShanten, danger);
    const best = this.bestDiscard(p, {
      forbiddenKinds: new Set(cantPlays.map((value) => Math.floor(value / 10))),
      dangerKinds: danger,
      dangerWeight: fold ? 22 : currentShanten <= 1 ? 4 : 8,
      maxShantenLoss: fold ? currentShanten >= 3 ? 2 : 1 : 0,
      shantenLossPenalty: fold ? 90 : 260,
      forced: p.riichi && p.riichiTurn !== this.xunNum ? p.drawnTile : null
    });
    return { action: PlayAction.Normal, card: best.discardId };
  }
  dangerKinds(seat) {
    const threats = this.players
      .filter((player) => player.seat !== seat)
      .map((player) => ({
        player,
        openMelds: player.melds.filter((meld) => meld.type !== "ankan" && meld.type !== "babei").length,
        level: player.riichi ? 1 : player.melds.filter((meld) => meld.type !== "ankan" && meld.type !== "babei").length >= 2 ? 0.55 : 0
      }))
      .filter((threat) => threat.level > 0);
    if (!threats.length) return null;
    const visible = this.visibleCounts();
    const riskByKind = new Map();
    const safe = new Set();
    const risky = new Set();
    for (let suit = 1; suit <= 4; suit++) {
      const maxRank = suit === 4 ? 7 : 9;
      for (let rank = 1; rank <= maxRank; rank++) {
        const kind = suit * 10 + rank;
        const idx = tileIndex(tileId(suit, rank, 1));
        let risk = 0;
        for (const { player, level } of threats) {
          if (player.discardKinds.has(kind)) continue;
          let threatRisk;
          if (suit === 4) {
            const shown = visible[idx] || 0;
            threatRisk = shown >= 3 ? 0 : shown === 2 ? 4 : shown === 1 ? 9 : 14;
          } else {
            threatRisk = rank === 1 || rank === 9 ? 8 : rank === 2 || rank === 8 ? 12 : rank === 3 || rank === 7 ? 15 : 19;
            const sujiSafe = [rank - 3, rank + 3].some((otherRank) => otherRank >= 1 && otherRank <= 9 && player.discardKinds.has(suit * 10 + otherRank));
            if (sujiSafe) threatRisk *= 0.48;
            const leftWall = rank > 1 && visible[idx - 1] >= 4;
            const rightWall = rank < 9 && visible[idx + 1] >= 4;
            if (leftWall || rightWall) threatRisk *= 0.55;
            if ((rank === 1 && rightWall) || (rank === 9 && leftWall)) threatRisk = 0;
          }
          risk = Math.max(risk, threatRisk * level);
        }
        riskByKind.set(kind, risk);
        if (risk === 0) safe.add(kind);
        else if (risk >= 12) risky.add(kind);
      }
    }
    return { threats: threats.length, safe, risky, riskByKind };
  }
  aiShouldFold(p, shanten, danger) {
    if (!danger) return false;
    const ranks = this.players.map((player) => player.score).sort((a, b) => b - a);
    const leading = p.score === ranks[0];
    const allLast = this.isAllLast();
    if (allLast && !leading) return shanten >= 3;
    if (allLast && leading) return shanten >= 1;
    const dora = p.hand.filter((tile) => this.doraKinds().has(kindOf2(tile)) || this.akaSet.has(tile)).length;
    if (shanten >= 3) return true;
    if (shanten === 2 && dora < 2) return true;
    return shanten === 1 && danger.threats > 1 && dora === 0;
  }
  riichiDecision(p, danger) {
    const discardKinds = this.formalTenpaiDiscards(p);
    let best = null;
    const remainOf = this.remainOfFor(p);
    for (const kind of discardKinds) {
      const card = p.hand.find((tile) => kindOf2(tile) === kind && !this.akaSet.has(tile)) ?? p.hand.find((tile) => kindOf2(tile) === kind);
      const hand = p.hand.slice();
      hand.splice(hand.indexOf(card), 1);
      const waits = handWaits(hand, p.melds, remainOf);
      let damaYaku = false;
      for (const wait of waits.waits) {
        if (calcWin(hand, p.melds, this.akaSet, this.winOpts(p, true, wait)).hasYaku) {
          damaYaku = true;
          break;
        }
      }
      const candidate = { card, ukeire: waits.ukeire, waitCount: waits.waitKinds.length, damaYaku };
      if (!best || candidate.ukeire > best.ukeire || candidate.ukeire === best.ukeire && candidate.waitCount > best.waitCount || candidate.ukeire === best.ukeire && candidate.waitCount === best.waitCount && candidate.card < best.card) best = candidate;
    }
    if (!best) return null;
    const scores = this.players.map((player) => player.score);
    const leading = p.score === Math.max(...scores);
    const lead = p.score - Math.max(...scores.filter((_, seat) => seat !== p.seat));
    const badWait = best.ukeire <= 2 || best.waitCount === 1 && best.ukeire <= 3;
    if (best.damaYaku && (danger && badWait || this.isAllLast() && leading && lead >= 8_000)) {
      return { action: PlayAction.Normal, card: best.card };
    }
    if (best.ukeire <= 0 && best.damaYaku) return { action: PlayAction.Normal, card: best.card };
    return { action: PlayAction.Riichi, card: best.card };
  }
  aiWantsKan(p, danger = null) {
    const scores = this.players.map((player) => player.score);
    const leading = p.score === Math.max(...scores);
    if (danger || this.isAllLast() && leading) return false;
    if (p.riichi) return true;
    const shanten = this.currentShanten(p);
    const dora = p.hand.filter((tile) => this.doraKinds().has(kindOf2(tile)) || this.akaSet.has(tile)).length;
    return shanten >= 2 || dora >= 2 || p.seat === this.dealerSeat && shanten >= 1;
  }
  aiClaim(seat, discarderSeat, card, can) {
    const p = this.players[seat];
    if (can.includes(PlayAction.Hu)) return { action: PlayAction.Hu };
    const current = this.currentShanten(p);
    const danger = this.dangerKinds(seat);
    if (this.aiShouldFold(p, current, danger)) return null;

    if (can.includes(PlayAction.MingGang)) {
      const after = this.shantenAfterClaim(p, card, "pon");
      if (after <= current && this.worthOpening(p, card, "kan") && this.aiWantsKan(p, danger)) {
        return { action: PlayAction.MingGang, otherCards: this.previewTiles(p, card, 3) };
      }
    }
    if (can.includes(PlayAction.Peng)) {
      const after = this.shantenAfterClaim(p, card, "pon");
      if (after < current && this.worthOpening(p, card, "pon")) {
        return { action: PlayAction.Peng, otherCards: this.previewTiles(p, card, 2) };
      }
    }
    if (can.includes(PlayAction.Chi)) {
      let best = null;
      for (const option of this.chiOptions(p, card)) {
        const after = this.shantenAfterClaim(p, card, "chi", option);
        const candidate = { option, after };
        if (!best || candidate.after < best.after || candidate.after === best.after && candidate.option.join() < best.option.join()) best = candidate;
      }
      if (best && best.after < current && this.worthOpening(p, card, "chi", best.option)) {
        return { action: PlayAction.Chi, otherCards: best.option };
      }
    }
    return null;
  }
  currentShanten(p) {
    return handShanten(p.hand, p.melds);
  }
  isYakuhaiKind(p, kind) {
    const { suit, rank } = decodeId(tileId(Math.floor(kind / 10), kind % 10, 1));
    return suit === 4 && (rank >= 5 || rank === this.roundWind || rank === this.seatWindOf(p.seat));
  }
  hasOpenYakuRoute(p, card, claimKind, used = []) {
    const proposedType = claimKind === "chi" ? "chi" : "pon";
    const proposed = { type: proposedType, tiles: [...used, card] };
    const melds = p.melds.concat([proposed]);
    const tiles = p.hand.concat([card], used).concat(melds.flatMap((meld) => meld.tiles || []));
    const tripletKinds = new Set(melds
      .filter((meld) => meld.type === "pon" || meld.type === "kan" || meld.type === "ankan")
      .map((meld) => kindOf2(meld.tiles[0])));
    if (claimKind !== "chi" && this.isYakuhaiKind(p, kindOf2(card))) return true;
    if ([...tripletKinds].some((kind) => this.isYakuhaiKind(p, kind))) return true;
    const decoded = tiles.map(decodeId);
    if (decoded.every(({ suit, rank }) => suit !== 4 && rank >= 2 && rank <= 8)) return true;
    const suits = new Set(decoded.filter(({ suit }) => suit !== 4).map(({ suit }) => suit));
    if (suits.size <= 1) return true;
    if (melds.every((meld) => meld.type !== "chi")) {
      const counts = new Map();
      for (const tile of p.hand) counts.set(kindOf2(tile), (counts.get(kindOf2(tile)) || 0) + 1);
      const pairOrTriplet = [...counts.values()].filter((count) => count >= 2).length;
      if (pairOrTriplet + melds.length >= 4) return true;
    }
    return false;
  }
  worthOpening(p, card, kind, used = []) {
    if (!this.hasOpenYakuRoute(p, card, kind, used)) return false;
    const current = this.currentShanten(p);
    if (kind === "pon" && this.isYakuhaiKind(p, kindOf2(card))) return true;
    const doraKinds = this.doraKinds();
    const dora = p.hand.filter((tile) => doraKinds.has(kindOf2(tile)) || this.akaSet.has(tile)).length;
    return current <= 2 || dora >= 2;
  }
  shantenAfterClaim(p, card, kind, chiTiles = null) {
    const hand = p.hand.slice();
    let meld;
    if (kind === "pon") {
      const used = [];
      for (let i = 0; i < 2; i++) {
        const idx = hand.findIndex((t) => kindOf2(t) === kindOf2(card));
        if (idx >= 0) used.push(hand.splice(idx, 1)[0]);
      }
      if (used.length < 2) return 99;
      meld = { type: "pon", tiles: [...used, card] };
    } else {
      if (!chiTiles) return 99;
      for (const t of chiTiles) {
        const i = hand.indexOf(t);
        if (i >= 0) hand.splice(i, 1);
      }
      meld = { type: "chi", tiles: [...chiTiles, card] };
    }
    const action = kind === "chi" ? PlayAction.Chi : PlayAction.Peng;
    const forbiddenKinds = this.kuikaeKinds(action, meld.tiles, card);
    try {
      return chooseDiscard(hand, p.melds.concat([meld]), {
        doraKinds: this.doraKinds(),
        akaSet: this.akaSet,
        forbiddenKinds
      }).shanten;
    } catch {
      return 99;
    }
  }
  previewTiles(p, card, n) {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const t of p.hand) {
      if (kindOf2(t) === kindOf2(card) && !seen.has(t)) {
        out.push(t);
        seen.add(t);
      }
      if (out.length >= n) break;
    }
    return out;
  }
  // ================= 人类输入 =================
  // 注意竞态：awaitTurn 先 emit(NtfSendCard) 再 await waitHuman('draw') 设置 _pending。
  // 客户端在收到 NtfSendCard 的瞬间就可能调用 submitDraw，此时 _pending 尚未就绪，
  // 直接调用会成 no-op 导致引擎永久等待。因此 submitDraw/submitClaim 在未就绪时
  // 缓存请求，waitHuman 进入等待时立即消费缓冲，避免死锁。
  setInternalState(values) {
    for (const [key, value] of Object.entries(values || {})) {
      const state = Number(key);
      if (Number.isInteger(state) && state >= 0 && state <= 5) this.internalState[state] = !!value;
    }
  }
  setHumanAutoplay(enabled) {
    this.autoHuman = !!enabled;
    if (!this.autoHuman || !this._pending) return;
    const pending = this._pending;
    this.resolveHumanPending(pending, this.timeoutHumanAction(pending.kind));
  }
  automaticHumanAction(kind) {
    const expected = kind === "draw" ? this._expectedDraw : this._expectedClaim;
    if (!expected) return null;
    if (expected.actions.includes(PlayAction.Hu) && this.internalState[1]) return { action: PlayAction.Hu };
    if (kind === "claim") return this.internalState[2] ? { action: PlayAction.Guo, otherCards: [] } : null;
    const player = this.players[expected.seat];
    if (expected.actions.includes(PlayAction.AnGang) && player.riichi && this.internalState[4]) {
      return { action: PlayAction.AnGang, card: this.concealedQuadTile(player) };
    }
    if (expected.actions.includes(PlayAction.BaBei) && player.riichi && this.internalState[5]) {
      return { action: PlayAction.BaBei, card: this.northInHand(player) };
    }
    if (this.internalState[3] && expected.drew && player.drawnTile != null) {
      return { action: PlayAction.Normal, card: player.drawnTile };
    }
    return null;
  }
  timeoutHumanAction(kind) {
    if (kind === "claim") return { action: PlayAction.Guo, otherCards: [] };
    const expected = this._expectedDraw;
    const player = this.players[expected.seat];
    if (expected.drew && player.drawnTile != null) return { action: PlayAction.Normal, card: player.drawnTile };
    const forbiddenKinds = new Set((expected.cantPlays || []).map((value) => Math.floor(value / 10)));
    return { action: PlayAction.Normal, card: this.bestDiscard(player, { forbiddenKinds }).discardId };
  }
  resolveHumanPending(pending, payload) {
    if (this._pending !== pending) return;
    if (pending.timer) clearTimeout(pending.timer);
    const player = this.players[0];
    const elapsed = (Date.now() - pending.startedAt) / 1_000;
    const timeBank = Number.isFinite(player.timeBank) ? player.timeBank : this.extraTime;
    player.timeBank = Math.max(0, timeBank - Math.max(0, elapsed - this.baseTime));
    if (pending.kind === "draw") this._expectedDraw = null;
    else this._expectedClaim = null;
    this._pending = null;
    pending.resolve(payload || {});
  }
  waitHuman(kind) {
    return new Promise((resolve) => {
      const pending = { kind, resolve, startedAt: Date.now(), timer: null };
      this._pending = pending;
      const buffered = kind === "draw" ? this._bufferedDraw : this._bufferedClaim;
      if (buffered != null) {
        if (kind === "draw") this._bufferedDraw = null;
        else this._bufferedClaim = null;
        this.resolveHumanPending(pending, buffered);
        return;
      }
      const automatic = this.automaticHumanAction(kind);
      if (automatic) {
        queueMicrotask(() => this.resolveHumanPending(pending, automatic));
        return;
      }
      if (this.autoHuman) {
        const payload = this.timeoutHumanAction(kind);
        queueMicrotask(() => this.resolveHumanPending(pending, payload));
        return;
      }
      const player = this.players[0];
      const timeoutMs = Math.max(0, this.baseTime + player.timeBank) * 1_000;
      pending.timer = setTimeout(() => {
        const payload = this.timeoutHumanAction(kind);
        this.resolveHumanPending(pending, payload);
      }, timeoutMs);
    });
  }
  submitDraw(payload) {
    const result = this.validateTurnPayload(payload);
    if (result !== Result.Succ) return result;
    this._expectedDraw = null;
    this._processing = true;
    if (this._pending && this._pending.kind === "draw") {
      this.resolveHumanPending(this._pending, payload || {});
    } else {
      this._bufferedDraw = payload || {};
    }
    return Result.Succ;
  }
  submitClaim(payload) {
    const result = this.validateClaimPayload(payload);
    if (result !== Result.Succ) return result;
    this._expectedClaim = null;
    this._processing = true;
    if (this._pending && this._pending.kind === "claim") {
      this.resolveHumanPending(this._pending, payload || {});
    } else {
      this._bufferedClaim = payload || {};
    }
    return Result.Succ;
  }
  cancelPending() {
    this._expectedDraw = null;
    this._expectedClaim = null;
    this._bufferedDraw = null;
    this._bufferedClaim = null;
    if (!this._pending) return;
    if (this._pending.timer) clearTimeout(this._pending.timer);
    const resolve = this._pending.resolve;
    this._pending = null;
    resolve({});
  }
  // 调试快照
  snapshot() {
    return {
      ju: this.juNum,
      honba: this.honba,
      dealer: this.dealerSeat,
      remain: this.remain,
      dora: this.doraIndicators.map(tileName),
      players: this.players.map((p) => ({
        seat: p.seat,
        score: p.score,
        riichi: p.riichi,
        hand: p.hand.map(tileName).join(" "),
        melds: p.melds.map((m) => m.type + ":" + m.tiles.map(tileName).join("")).join(" ")
      }))
    };
  }
};
function mulberry32(a) {
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export { GameEngine, mulberry32 };
