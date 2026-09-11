import { ECONOMY_CATALOG as C } from './economy_catalog.mjs';

// ShopType 不是 UI 的 MahjongShopLabelType；从原元数据提取，不能直接使用标签编号。
export const SHOP_TYPE = Object.freeze(C.shopTypes);
export const SHOP_ERROR = Object.freeze({ INVALID: 1, INSUFFICIENT: 2010, LIMIT: 2011, NOT_FOUND: 2012 });
const TOKEN_IDS = [60002, 60001, 60009, 60010, 60011, 60012];
const DAY = 86400;
const OFFSET = 8 * 3600;
const P = () => globalThis.__mj.proto;
const dayStart = (now) => Math.floor((now + OFFSET) / DAY) * DAY - OFFSET;
const monthStart = (now) => {
  const date = new Date((now + OFFSET) * 1000);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1) / 1000 - OFFSET;
};
const equal = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
const positive = (value) => Number.isSafeInteger(value) && value > 0;

function decodeMap(row, field) {
  const result = new Map();
  for (const [number, wire, bytes] of P().parse(row)) {
    if (number !== field || wire !== 2) continue;
    const entry = P().dict(bytes);
    result.set(entry[1], entry[2] || new Uint8Array());
  }
  return result;
}

function stockFor(user, now, refreshCount) {
  let seed = ((dayStart(now) / DAY) ^ (refreshCount * 2654435761) ^ user.uid) >>> 0;
  const used = new Set();
  return C.coinSlots.map((slot) => {
    const pool = (slot.type === 7 ? C.gifts : C.materials)
      .filter((item) => item.price > 0 && (!slot.rarity || item.rarity === slot.rarity) && !used.has(item.id));
    if (!pool.length) throw new Error('雀币商店配置不足以生成商品');
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    const item = pool[(seed >>> 0) % pool.length];
    used.add(item.id);
    return { id: item.id, type: slot.type, rarity: slot.rarity, count: slot.count, price: item.price };
  });
}

function normalizeLimits(map, catalog, countField, start, now) {
  for (const item of catalog) {
    const bytes = map.get(item.id);
    if (!bytes || item.buyType !== 2 || Number(P().get(bytes, 4) || 0) >= start) continue;
    map.set(item.id, P().setVarint(P().setVarint(bytes, countField, 0), 4, now));
  }
}

function readState(user, now) {
  const row = user.row(30, '0') || new Uint8Array();
  const d = P().dict(row);
  const state = {
    row,
    lastRefresh: Number(d[2] || 0),
    // 对照 GetRefreshShopCount/FreeRefreshShopCount：f4 为总次数，f6 为免费额度。
    refreshCount: Number(d[4] || 0),
    freeAllowance: Number(d[6] || 0),
    items: P().parse(row).filter(([n, w]) => n === 1 && w === 2).map(([, , bytes]) => {
      const item = P().dict(bytes);
      return { id: item[1], type: item[2], rarity: item[3] || 0, count: item[4] || 0, price: item[5] || 0 };
    }),
    grocery: decodeMap(row, 5),
    honor: decodeMap(row, 8),
  };
  if (!state.items.length || state.lastRefresh < dayStart(now)) {
    state.lastRefresh = now;
    state.refreshCount = 0;
    state.freeAllowance = 1;
    state.items = stockFor(user, now, 0);
  }
  normalizeLimits(state.grocery, C.grocery, 3, dayStart(now), now);
  normalizeLimits(state.honor, C.honor, 2, monthStart(now), now);
  return state;
}

function encodeState(state) {
  const w = P().W();
  for (const field of P().parse(state.row)) {
    if (![1, 2, 4, 5, 6, 8].includes(field[0])) P().reencode(w, ...field);
  }
  for (const item of state.items) {
    w.s(1, P().W().v(1, item.id).v(2, item.type).v(3, item.rarity).v(4, item.count).v(5, item.price).bytes());
  }
  w.v(2, state.lastRefresh).v(4, state.refreshCount).v(6, state.freeAllowance);
  for (const [field, map] of [[5, state.grocery], [8, state.honor]]) {
    for (const [id, bytes] of map) w.s(field, P().W().v(1, id).s(2, bytes).bytes());
  }
  return w.bytes();
}

export function synchronizeShop(user, now = Math.floor(Date.now() / 1000)) {
  const state = readState(user, now);
  const bytes = encodeState(state);
  return equal(state.row, bytes) ? null : { 30: [user.setRow(30, '0', bytes)] };
}

function uniqueReward(user, item) {
  if (item.type === 26) {
    if (user.row(26, item.id)) return { error: SHOP_ERROR.LIMIT };
    // 离线快照保留全角色、最高好感度；缺少的旧档案使用同一角色模板，不复制他人装备。
    const template = new user.constructor(P().b64decode(globalThis.__mj.data.userdataB64), user.uid);
    const bytes = template.row(26, item.id);
    return bytes ? { dtype: 26, key: String(item.id), bytes } : { error: SHOP_ERROR.NOT_FOUND };
  }
  if (![14, 15, 17].includes(item.type)) return { error: SHOP_ERROR.NOT_FOUND };
  const row = user.row(item.type, '0') || new Uint8Array();
  const owned = decodeMap(row, 1);
  if (owned.has(item.id)) return { error: SHOP_ERROR.LIMIT };
  const template = new user.constructor(P().b64decode(globalThis.__mj.data.userdataB64), user.uid);
  const original = decodeMap(template.row(item.type, '0') || new Uint8Array(), 1).get(item.id);
  if (!original) return { error: SHOP_ERROR.NOT_FOUND };
  const bytes = P().W().raw(row).s(1, P().W().v(1, item.id).s(2, original).bytes()).bytes();
  return { dtype: item.type, key: '0', bytes };
}

/** 购买数量来自 f3；普通四商店 f4 固定 1，价格、库存及奖励均由服务端目录决定。 */
export function purchase(user, request, now = Math.floor(Date.now() / 1000)) {
  const { shopType, itemId, quantity, exchangeCount, gearIndex = 0 } = request;
  if (!positive(itemId) || !positive(quantity) || quantity > 0x7fffffff || exchangeCount !== 1 || gearIndex !== 0) {
    return { error: SHOP_ERROR.INVALID };
  }
  const state = readState(user, now);
  let item, currency, limitMap, countField;
  if (shopType === SHOP_TYPE.COIN) {
    item = state.items.find((entry) => entry.id === itemId);
    currency = 60001;
  } else if (shopType === SHOP_TYPE.GROCERY) {
    item = C.grocery.find((entry) => entry.id === itemId);
    currency = item && TOKEN_IDS[item.tokenType];
    limitMap = state.grocery; countField = 3;
  } else if (shopType === SHOP_TYPE.RECRUIT) {
    item = C.recruit.find((entry) => entry.id === itemId);
    currency = 60009;
  } else if (shopType === SHOP_TYPE.HONOR) {
    item = C.honor.find((entry) => entry.id === itemId);
    currency = 60012;
    limitMap = state.honor; countField = 2;
  }
  if (!item || !currency || !positive(item.price)) return { error: SHOP_ERROR.NOT_FOUND };
  const oldLimit = limitMap?.get(itemId) || new Uint8Array();
  const bought = Number(oldLimit.length ? P().get(oldLimit, countField) || 0 : 0);
  if ((shopType === SHOP_TYPE.COIN && quantity > item.count) || (item.limit > 0 && bought + quantity > item.limit)) {
    return { error: SHOP_ERROR.LIMIT };
  }
  const cost = item.price * quantity;
  if (!Number.isSafeInteger(cost)) return { error: SHOP_ERROR.INVALID };
  if (user.inventoryCount(6, currency) < cost) return { error: SHOP_ERROR.INSUFFICIENT };
  const stackable = [6, 7, 8].includes(item.type);
  const unique = stackable ? null : uniqueReward(user, item);
  if (unique?.error) return unique;
  if (!stackable && quantity !== 1) return { error: SHOP_ERROR.LIMIT };

  if (shopType === SHOP_TYPE.COIN) item.count -= quantity;
  if (limitMap) {
    let bytes = P().setVarint(oldLimit, 1, item.id);
    bytes = P().setVarint(bytes, countField, bought + quantity);
    bytes = P().setVarint(bytes, countField === 3 ? 2 : 3, item.buyType);
    limitMap.set(item.id, P().setVarint(bytes, 4, now));
  }
  const shopBytes = encodeState(state);
  const deltas = [{ dtype: 6, id: currency, count: -cost }];
  if (stackable) deltas.push({ dtype: item.type, id: item.id, count: quantity });
  let changes;
  try { changes = user.changeInventory(deltas) || {}; }
  catch (error) {
    if (error instanceof RangeError) return { error: SHOP_ERROR.INVALID };
    throw error;
  }
  if (unique) changes[unique.dtype] = [user.setRow(unique.dtype, unique.key, unique.bytes)];
  changes[30] = [user.setRow(30, '0', shopBytes)];
  return { error: 0, changes, itemId, quantity, rewards: [[item.id, quantity]] };
}

export function refreshShop(user, now = Math.floor(Date.now() / 1000)) {
  const state = readState(user, now);
  const free = state.refreshCount < state.freeAllowance;
  const index = Math.max(0, state.refreshCount - state.freeAllowance);
  const offer = C.refresh[Math.min(index, C.refresh.length - 1)];
  // 刷新配置的 TokenType 与普通商店枚举不同：0 雀币、1 梦石。
  const currency = offer.tokenType === 0 ? 60001 : 60002;
  const cost = free ? 0 : offer.price;
  if (user.inventoryCount(6, currency) < cost) return { error: SHOP_ERROR.INSUFFICIENT };
  state.refreshCount += 1;
  state.lastRefresh = now;
  state.items = stockFor(user, now, state.refreshCount);
  const bytes = encodeState(state);
  const changes = user.changeInventory([{ dtype: 6, id: currency, count: -cost }]) || {};
  changes[30] = [user.setRow(30, '0', bytes)];
  return { error: 0, changes };
}
