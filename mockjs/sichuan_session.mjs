import { SichuanEngine } from './sichuan_engine.mjs';
import { chooseSichuanDiscard } from './sichuan_ai.mjs';

const DEFAULT_TIMEOUTS = Object.freeze({ prepare: 20000, exchange: 20000, missing: 15000, turn: 15000, claim: 10000 });
const failed = (error) => ({ ok: false, error });

/**
 * 单局血战的服务端生命周期，不是 Unity 协议适配器。
 * 连接代次和 windowId 由可信传输层绑定，不把 GameNumber 冒充动作窗口。
 * onUpdate 只提供本人视图；onFinish 只提供结算摘要，均不包含未来牌山。
 * 不写钱包/档案，不复用日麻段位结算；同一实例只能开局和结束一次。
 */
export class SichuanSession {
  #engine;
  #status = 'idle';
  #humanSeat;
  #timeouts;
  #aiDelay;
  #clock;
  #jobs = new Map();
  #deadline = null;
  #prepareDeadline = null;
  #connectionId = 1;
  #connected = true;
  #autoplay = false;
  #onUpdate;
  #onFinish;
  #onError;
  #result = null;

  constructor({ humanSeat = 0, aiDelayMs = 350, timeoutsMs = {}, clock = {},
    onUpdate = () => {}, onFinish = () => {}, onError = () => {}, ...rules } = {}) {
    if (!Number.isInteger(humanSeat) || humanSeat < 0 || humanSeat > 3
        || !Number.isSafeInteger(aiDelayMs) || aiDelayMs < 0 || aiDelayMs > 60000
        || !timeoutsMs || typeof timeoutsMs !== 'object' || Array.isArray(timeoutsMs)
        || Object.keys(timeoutsMs).some((phase) => !Object.hasOwn(DEFAULT_TIMEOUTS, phase))) {
      throw new RangeError('无效的血战会话配置');
    }
    this.#timeouts = { ...DEFAULT_TIMEOUTS, ...timeoutsMs };
    if (Object.values(this.#timeouts).some((time) => !Number.isSafeInteger(time) || time <= 0 || time > 3600000)) {
      throw new RangeError('无效的血战超时时间');
    }
    if (![onUpdate, onFinish, onError].every((callback) => typeof callback === 'function')) throw new TypeError('无效的会话回调');
    this.#clock = {
      now: clock.now ?? (() => Date.now()),
      setTimeout: clock.setTimeout ?? ((callback, delay) => setTimeout(callback, delay)),
      clearTimeout: clock.clearTimeout ?? ((timer) => clearTimeout(timer)),
    };
    if (!Object.values(this.#clock).every((fn) => typeof fn === 'function')) throw new TypeError('无效的会话时钟');
    this.#engine = new SichuanEngine(rules);
    this.#humanSeat = humanSeat;
    this.#aiDelay = aiDelayMs;
    this.#onUpdate = onUpdate;
    this.#onFinish = onFinish;
    this.#onError = onError;
  }

  get status() { return this.#status; }
  get matchOver() { return this.#status === 'ended'; }
  get stopped() { return this.#status === 'stopped' || this.#status === 'failed'; }
  get result() { return structuredClone(this.#result); }

  get timeoutsMs() { return { ...this.#timeouts }; }
  /** 仅供服务端诊断及最终的协议适配，不得直接广播这个快照。 */
  snapshot() { return this.#engine.snapshot(); }

  view() {
    const game = this.#engine.view(this.#humanSeat);
    const playing = this.#status === 'playing';
    const expiresAt = this.#status === 'preparing' ? this.#prepareDeadline
      : playing && game.options.length && this.#deadline?.windowId === game.windowId ? this.#deadline.expiresAt : null;
    return { ...game, options: playing ? game.options : [], status: this.#status,
      connectionId: this.#connectionId, connected: this.#connected, autoplay: this.#autoplay || !this.#connected,
      expiresAt, remainingMs: expiresAt === null ? 0 : Math.max(0, expiresAt - this.#clock.now()) };
  }

  start() {
    if (this.#status !== 'idle') return failed('alreadyStarted');
    this.#status = 'preparing';
    this.#prepareDeadline = this.#clock.now() + this.#timeouts.prepare;
    this.#refresh('prepare');
    return { ok: true };
  }

  #authorize(connectionId) {
    if (!this.#connected || connectionId !== this.#connectionId) return failed('staleConnection');
    if (this.stopped || this.matchOver || this.#status === 'idle') return failed('inactiveSession');
    return null;
  }

  prepare(connectionId) {
    const denied = this.#authorize(connectionId);
    if (denied) return denied;
    if (this.#status !== 'preparing') return failed('invalidPhase');
    this.#begin();
    return { ok: true };
  }

  submit(chosen, { connectionId, windowId } = {}) {
    const denied = this.#authorize(connectionId);
    if (denied) return denied;
    if (this.#status !== 'playing') return failed('invalidPhase');
    if (this.#autoplay) return failed('autoplay');
    if (windowId !== this.#engine.windowId) return failed('staleWindow');
    if (this.#deadline?.windowId === windowId && this.#clock.now() >= this.#deadline.expiresAt) return failed('expiredWindow');
    // submit 在引擎内部按当前席位、窗口和实际实体牌做原子校验。
    const result = this.#engine.submit(this.#humanSeat, chosen, windowId);
    if (result.ok) this.#refresh('action');
    return result;
  }

  setAutoplay(enabled, connectionId) {
    const denied = this.#authorize(connectionId);
    if (denied) return denied;
    if (typeof enabled !== 'boolean') return failed('invalidAutoplay');
    this.#autoplay = enabled;
    this.#refresh('autoplay');
    return { ok: true };
  }

  /** 旧 socket 的迟到 close 不能让新连接进入托管。 */
  detach(connectionId) {
    if (connectionId !== this.#connectionId || !this.#connected) return failed('staleConnection');
    if (this.stopped || this.matchOver) return failed('inactiveSession');
    this.#connected = false;
    this.#connectionId += 1;
    this.#refresh('detach');
    return { ok: true };
  }

  /** 同进程换连接：窗口及截止时间保留；主动托管与断线托管分开。 */
  attach() {
    if (this.stopped || this.matchOver || this.#status === 'idle') return failed('inactiveSession');
    this.#connectionId += 1;
    this.#connected = true;
    this.#refresh('attach');
    return { ok: true, view: this.view() };
  }

  stop() {
    if (this.stopped || this.matchOver) return;
    this.#status = 'stopped';
    this.#cancelAll();
    this.#notify('stop');
  }

  #call(callback, value) {
    try { callback(value); } catch (error) {
      // 推送/外部回调异常不回滚已接受动作，也不允许重跑终局记账。
      try { this.#onError(error); } catch { /* 错误报告器不能破坏权威局序。 */ }
    }
  }

  #notify(reason) { this.#call(this.#onUpdate, { reason, view: this.view() }); }

  #cancel(seat) {
    const job = this.#jobs.get(seat);
    if (job) {
      this.#jobs.delete(seat);
      this.#clock.clearTimeout(job.timer);
    }
  }

  #cancelAll() { for (const seat of this.#jobs.keys()) this.#cancel(seat); }

  #begin() {
    this.#cancelAll();
    this.#status = 'playing';
    this.#refresh('start');
  }

  #schedule(seat, key, due, callback) {
    const previous = this.#jobs.get(seat);
    if (previous?.key === key && previous.due === due) return;
    this.#cancel(seat);
    const job = { key, due, timer: null };
    this.#jobs.set(seat, job);
    job.timer = this.#clock.setTimeout(() => {
      // 即使已 clearTimeout 的回调被事件循环取出，也不能跨窗口或连接执行。
      if (this.#jobs.get(seat) !== job || this.stopped || this.matchOver) return;
      this.#jobs.delete(seat);
      try { callback(); } catch (error) {
        this.#status = 'failed';
        this.#cancelAll();
        this.#call(this.#onError, error);
      }
    }, Math.max(0, due - this.#clock.now()));
  }

  #timeoutAction() {
    const view = this.#engine.view(this.#humanSeat);
    if (view.phase === 'claim') return { type: 'pass', tiles: [] };
    if (view.phase === 'turn') {
      const drawnTile = this.#engine.snapshot().drawnTile;
      const drawnDiscard = view.options.find((option) => option.type === 'discard' && option.tiles[0] === drawnTile);
      // 超时不会默许胡/杠；缺门限制优先于摸切。
      return drawnDiscard ?? { type: 'discard', tiles: [chooseSichuanDiscard(view).tile] };
    }
    return this.#engine.chooseAction(this.#humanSeat);
  }

  #refresh(reason) {
    if (this.stopped || this.matchOver || this.#status === 'idle') return;
    const now = this.#clock.now();
    if (this.#status === 'preparing') {
      const automatic = !this.#connected || this.#autoplay;
      const due = automatic ? now : this.#prepareDeadline;
      this.#schedule(-1, `prepare:${this.#connectionId}:${automatic}`, due, () => this.#begin());
      this.#notify(reason);
      return;
    }
    if (this.#engine.phase === 'ended') {
      this.#cancelAll();
      this.#status = 'ended';
      const state = this.#engine.snapshot();
      this.#result = { gameType: state.rules.gameType, seed: state.seed, rules: state.rules, scores: state.scores,
        winners: state.winners, reason: state.endReason };
      // 两个回调都只能看到副本；先封存终局再执行，重入不能再次结束或开局。
      this.#notify('finish');
      this.#call(this.#onFinish, this.result);
      return;
    }
    const windowId = this.#engine.windowId;
    const ownOptions = this.#engine.legalActions(this.#humanSeat);
    if (ownOptions.length && this.#deadline?.windowId !== windowId) {
      this.#deadline = { windowId, expiresAt: now + this.#timeouts[this.#engine.phase] };
    }
    for (let seat = 0; seat < 4; seat += 1) {
      if (!this.#engine.legalActions(seat).length) { this.#cancel(seat); continue; }
      const automatic = seat !== this.#humanSeat || this.#autoplay || !this.#connected;
      const key = `${windowId}:${automatic}:${this.#connectionId}`;
      const delay = this.#connected ? this.#aiDelay : 0;
      const previous = this.#jobs.get(seat);
      const due = automatic ? previous?.key === key ? previous.due : now + delay : this.#deadline.expiresAt;
      this.#schedule(seat, key, due, () => {
        if (this.#engine.windowId !== windowId) return;
        const chosen = automatic ? this.#engine.chooseAction(seat) : this.#timeoutAction();
        const result = this.#engine.submit(seat, chosen, windowId);
        if (!result.ok) throw new Error(`血战自动动作被拒绝 seat=${seat} window=${windowId} error=${result.error}`);
        this.#refresh(automatic ? 'ai' : 'timeout');
      });
    }
    this.#notify(reason);
  }
}
