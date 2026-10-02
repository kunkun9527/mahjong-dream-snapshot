# local/

## Responsibility
Node 进程层：启动器、静态文件 + 回环 WebSocket 服务、本地档案读写和一次性经济初始化。所有对局与协议逻辑都委托给 `mock/server.js`。

## Key files
- `launcher.mjs` — `npm start` / `start-game.bat` 入口；fork `server.mjs`，等端口就绪后打开 Edge/Chrome，转发 `--players/--length/--lang` 为 URL 参数。
- `server.mjs` — HTTP（MIME、Brotli、Range、路径穿越防护）+ `/ws` 单活动连接租约；启动时依次 import `mock/proto.js`、`mock/data.js`、`mock/userdata.js`、`mockjs/browser_entry.mjs`、`mock/server.js`，再用 `globalThis.__mj.server` 处理消息。
- `profile.mjs` — `userdata/profile.json` 的默认值、规范化、段位 PT（读 `economy_catalog` 的 22 档表）、战绩和原子写入。
- `economy.mjs` — `offlineEconomyVersion` 标记的一次性补给：雀币 ×100，其余货币 999999，七段起步。

## Flow
浏览器 → `/ws` → `mock.FakeWebSocket` 派发 → 回调 `onFinalResult` / `onMatchFinish` / `onSettingsChange` → `persistSoon()` 把档案与 `lobbyData`（背包等 DT 模块的 base64）串行写盘。

## Integration
- Depends on: `mock/*.js`（经 `globalThis.__mj`）、`mockjs/economy_catalog.mjs`
- Used by: `start-game.bat`、`package.json` 的 `start`、`test/local-*.test.mjs`

## Gotchas
- 存档写入必须走临时文件 + 原子替换，Windows 上 EPERM/EACCES/EBUSY 最多重试 3 次；损坏文件备份为 `profile.corrupt-<时间>.json`。
- `MJ_USERDATA_DIR` 隔离存档；测试必须用临时目录，不要写项目的 `userdata/`。
- WebSocket 只允许一个活动连接，残留的浏览器实例会让新连接收到 409，客户端显示“网络不稳定”。
- 断线时调用 `detachMatch()` 让 AI 接管真人席，不销毁牌局；同进程内可重连。
- 经济初始化只执行一次，重启不补满已花掉的货币。
