// 立直一局战（1-Round，原客户端 roomType=6）：只打一手，按真人和牌番数从原配置
// DailyCompetitionOneMatchRewardTb 领奖。配置键 = roomID × 10000 + roomLevel，与客户端
// OneRoundGameCfgMgr.GetOneMatchRewardCfg 一致：roomID 1 为梦石场、2 为雀币场，roomLevel 1..5 为报名档位。
import { ECONOMY_CATALOG as C } from './economy_catalog.mjs';
import { ManType } from './proto_enum.mjs';

export const ONE_ROUND_ROOM_TYPE = 6;

export function oneRoundRoom(roomId, roomLevel) {
  return C.oneRound.find((row) => row.id === roomId * 10_000 + roomLevel) || null;
}

/** riichi.EnumItemRewardLevel：1..4 番 → 1..4，满贯 5、跳满 6、倍满 7、三倍满 8、役满 9、双倍役满 10。 */
export function oneRoundRewardLevel(win) {
  if (!win) return 0;
  if (win.yakuman >= 2) return 10;
  if (win.manType >= ManType.ManGuan) return 4 + win.manType;
  return Math.min(Math.max(win.totalFan || 0, 0), 4);
}

/** 报名费与奖励一次结算到背包（DT 6）；返回 NtfGameStop 用的奖励字段与 DataChange。 */
export function settleOneRound(user, room, humanWin) {
  const level = oneRoundRewardLevel(humanWin);
  const rewards = level ? room.rewards[level - 1] : [];
  const deltas = room.cost.map((item) => ({ dtype: 6, id: item.id, count: -item.count }))
    .concat(rewards.map((item) => ({ dtype: 6, id: item.id, count: item.count })));
  return {
    itemRewardLevel: level,
    itemRewards: rewards.map((item) => ({ itemId: item.id, itemCount: item.count })),
    changes: user.changeInventory(deltas)
  };
}

/** 报名费足额才允许开局。 */
export function canAffordOneRound(user, room) {
  return room.cost.every((item) => user.inventoryCount(6, item.id) >= item.count);
}
