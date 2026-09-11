// 初始补给与老档案升级共享一次性标记；不能在每次登录/查询时覆盖已消费余额。
export const OFFLINE_ECONOMY_VERSION = 1;
export const INITIAL_LOCAL_COINS = 999_999;

export function initializeOfflineEconomy(profile, userData, config) {
  if (Number(profile.offlineEconomyVersion) >= OFFLINE_ECONOMY_VERSION) return false;
  const deltas = config.currencyIds.map((id) => {
    const before = userData.inventoryCount(6, id);
    const after = id === config.coinId ? before * 100 : INITIAL_LOCAL_COINS;
    return { dtype: 6, id, count: after - before };
  });
  // 背包先整体校验；若旧余额无法安全放大，不落下一半迁移或提前写版本标记。
  userData.changeInventory(deltas);
  profile.coins = INITIAL_LOCAL_COINS;
  profile.ranks = {
    yonma: { ...config.rank },
    sanma: { ...config.rank },
  };
  profile.offlineEconomyVersion = OFFLINE_ECONOMY_VERSION;
  return true;
}
