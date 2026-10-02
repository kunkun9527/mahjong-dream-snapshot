# 激情麻将 / 雀梦麻将 本地单机版

## Purpose
关服前的 Unity WebGL 客户端快照，修复为 Windows 本地单机版。原客户端只负责界面；Node.js 回环服务（127.0.0.1）负责协议、权威牌局、AI、商店和本地档案，运行时不访问外网。
已支持：立直四麻/三麻东风、半庄、一局战；四川血战 5022、血流 5021；四类商店。

## Entry points
- `start-game.bat` / `local/launcher.mjs` — 启动服务并打开浏览器。
- `local/server.mjs` — HTTP + WebSocket 服务，装载 `mock/` 兼容层。
- `game.html` + `offline-patch.js` — Unity 入口与离线补丁（WebSocket 指向本机、拦截外网请求）；`?mjLang=en` 改载 `Build_intl/` 英文国际版。
- `mock/server.js` — 全部消息处理器。
- `mockjs/engine.mjs` — 立直权威引擎。

## Commands
| 目的 | 命令 |
| --- | --- |
| 启动 | `npm start`（参数同 `start-game.bat --players=3 --length=hanchan --lang=en`） |
| 构建 bundle | `npm run build`（`mockjs/` → `mock/riichi.js`） |
| 语法检查 | `npm run check`（新增源码要加进 `package.json` 的 check 列表） |
| 测试 | `npm test`；单个：`node --test test/engine-smoke.test.mjs` |
| 调试 | `MJ_DEBUG=1 MJ_USERDATA_DIR=<临时目录> npm start`；URL 参数 `mjPlayers/mjLength/mjSeed/mjSpeed` |

修改 `mockjs/` 后：`npm run build` → `npm run check` → `npm test`，源码与 `mock/riichi.js` 一起提交。

## Directory map
| 目录 | 职责 | 地图 |
| --- | --- | --- |
| `local/` | Node 进程：启动器、静态/WS 服务、档案与经济初始化 | [local/codemap.md](local/codemap.md) |
| `mock/` | 原客户端兼容层：wrapper 协议、大厅数据、消息处理器、匹配 | [mock/codemap.md](mock/codemap.md) |
| `mockjs/` | ESM 后端源码：立直/四川引擎与 AI、商店、协议 | [mockjs/codemap.md](mockjs/codemap.md) |
| `tools/` | 从原 bundle 提取配置与协议的只读脚本 | [tools/codemap.md](tools/codemap.md) |

其他目录：`test/`（node:test，名称用中文描述行为）、`docs/`（`handoff.md`、`technical-architecture.md`、`repair-backlog.md`、`adr/`）、`Build/`、`Build_intl/`、`StreamingAssets/`、`TemplateData/`（Unity 产物，不要修改）、`userdata/`（运行时存档，Git 忽略）。

## Rules
- 不手改：`mock/riichi.js`、`mock/data.js`、`mockjs/*_catalog.mjs`、`*_desc.mjs`、Unity 构建产物、`userdata/`、`package-lock.json`（只随 npm 依赖变更）。
- 不重新接入生产域名、远端 WSS 或任何联网流程。
- 浏览器状态不是牌局真相；AI 不得读对手暗牌、未来牌山。
- 协议字段名、消息名、枚举值沿用原协议；改协议同时查 `mockjs/riichi_desc.mjs`、编解码调用方、`mock/server.js` 和测试。
- 规则基线：立直 ADR 0002（雀魂段位战）；四川 ADR 0004；存档 ADR 0001；商店经济 ADR 0003。
- 规则、协议、存档、服务行为的改动必须带回归测试；不提交 `.tmp-*`、截图等调试文件。
- 提交信息用 Conventional Commits（中文描述），例如 `fix(engine): 修正三麻拔北抢和`。
