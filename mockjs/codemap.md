# mockjs/

## Responsibility
可维护的 ESM 后端源码：立直麻将权威引擎与 AI、四川麻将（5021/5022）独立状态机、商店、一局战和 protobuf 编解码。经 `build_browser.mjs` 打包成 `mock/riichi.js`。

## Key files
- `browser_entry.mjs` — bundle 入口；定义 `RiichiSession`（计时、AI 调度、消息桥接），把各模块导出到 `globalThis.__mj`。
- `engine.mjs` — 立直 `GameEngine`：牌山、动作窗口、鸣牌/立直/杠/拔北、和了与流局、计分、局序（东风/半庄/一局）。牌局唯一真相。
- `ai.mjs`、`shanten.mjs` — AI 决策与向听；`yaku_map.mjs` 役种映射（计分依赖 `riichi` 包）。
- `tiles.mjs` — 实体牌 ID ↔ 牌种转换，红宝依赖它。
- `pb.mjs` + `riichi_desc.mjs` + `proto_enum.mjs` — 立直协议（protobufjs）。
- `shop.mjs` — 杂货铺/雀币/招募/荣耀积分四类商店的购买、限购与刷新（DT 30）。
- `one_round.mjs` — 一局战报名费与番数奖励。
- `sichuan_*.mjs` — 四川：`hand` 牌形 → `score` 计分 → `engine` 局序 → `settlement` 荒牌清算 → `session` 生命周期 → `requests` 上行 → `*notifications` 下行 → `table` 组合给服务端；`ai` 只读本人与公开信息。
- `majiang_pb.mjs` + `majiang_desc.mjs` — 四川用的 majiang 协议与 `GameServerLogicData` 信封。
- 生成数据：`economy_catalog.mjs`、`sichuan_catalog.mjs`、`majiang_desc.mjs`、`riichi_desc.mjs`，由 `tools/` 脚本生成，不要手改。

## Flow
服务端收到 20018 → `RiichiSession.handleClient` / `SichuanTable` → 引擎按当前动作窗口校验实体牌 → 提交状态 → 生成通知帧 → `sess.push`。终局回调 `onFinalResult` 交给服务端结算段位/雀币/奖励。

## Integration
- Used by: `mock/server.js`（经 bundle）、`local/*.mjs`（直接 import catalog）、`test/`
- Depends on: `protobufjs`、`riichi`

## Gotchas
- 所有动作先校验再改状态；非法动作后状态不变。
- AI 不得读取对手暗牌、未来牌山；四川 `snapshot()` 含全部暗牌，只能用 `view(seat)`。
- 规则争议：立直以 ADR 0002（雀魂段位战）为准；四川以 ADR 0004 为准，不套用立直规则。
- 改完必须 `npm run build`，并把 `mock/riichi.js` 一起提交。
