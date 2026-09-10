# AGENTS.md
> AI 编程助手与人类开发者的共同开发规范，由 pi-init 生成，请结合实际修订。

### 1. 项目概述

《激情麻将/雀梦麻将》关服前快照正在被修复为 Windows 本地单机版：原 Unity WebGL 客户端负责界面，Node.js 回环服务负责协议、权威牌局、AI 与本地档案。项目提供四麻/三麻的东风战与半庄，运行时不应访问外部服务；可维护的麻将引擎源码位于 `mockjs/`，浏览器 bundle 位于 `mock/riichi.js`。

核心技术栈与关键依赖：

- Node.js 22+、原生 ESM（`package.json` 的 `type` 为 `module`）。
- Unity WebGL 静态客户端资源：`Build/`、`StreamingAssets/`、`TemplateData/`；`Build_intl/` 为国际版资源。
- Node.js `http`、`child_process`、文件系统 API，以及 `ws` `8.21.3` 回环 WebSocket 服务。
- `protobufjs` `8.8.0` 处理麻将协议，`riichi` `1.2.0` 支持 AI/计分，`assert` `2.1.0` 提供断言。
- `esbuild` `0.28.2` 将 `mockjs/browser_entry.mjs` 打包为浏览器端 `mock/riichi.js`。
- Node.js 内置 `node:test` 测试运行器。

### 2. 快速命令

在项目根目录执行。需要 Node.js 22 或更高版本。

| 目的 | 命令 | 说明 |
| --- | --- | --- |
| 安装依赖 | `npm install` | 安装 `package.json` 与 `package-lock.json` 中的依赖。 |
| 本地启动 | `npm start` | 实际执行 `node local/launcher.mjs`，启动回环服务并尝试打开 Edge/Chrome。 |
| Windows 一键启动 | `start-game.bat` | 检查 Node.js 版本，必要时安装依赖，再启动本地游戏。 |
| 指定正式模式 | `start-game.bat --players=4 --length=east` | 也支持 `--players=4 --length=hanchan`、`--players=3 --length=east`、`--players=3 --length=hanchan`。 |
| 构建浏览器 bundle | `npm run build` | 执行 `node mockjs/build_browser.mjs`，生成 `mock/riichi.js`。 |
| 运行全部测试 | `npm test` | 实际执行 `node --test`。 |
| JavaScript 语法检查 | `npm run check` | 对协议、服务、引擎相关 `.js/.mjs` 文件执行 `node --check`。 |
| Lint | 待补充 | 当前没有 Lint 脚本或 ESLint/Biome 配置。 |
| 格式化 | 待补充 | 当前没有格式化脚本或 Prettier 配置。 |

### 3. 目录结构说明

- `index.html`：顶层 Unity 页面，嵌入 `game.html` 并处理页面方向。
- `game.html`：原 Unity WebGL 入口；加载 `offline-patch.js`、`Build/` 和 `StreamingAssets/`。
- `start-game.bat`：Windows 启动入口，检查 Node.js 22+ 并转发模式参数。
- `Build/`：中文 Unity WebGL 构建产物，包含 loader、`.data.unityweb`、framework、WASM 和 symbols。
- `Build_intl/`：国际版 Unity WebGL 构建产物；当前中文客户端完成标准不以它为目标。
- `StreamingAssets/`：Unity 运行时资源与 bundle。
- `TemplateData/`：Unity WebGL 页面模板、样式、图标和进度条资源。
- `local/`：本地服务层。`launcher.mjs` fork 服务进程并打开浏览器；`server.mjs` 提供静态文件、回环 WebSocket、会话和持久化接线；`profile.mjs` 负责档案默认值、迁移/规范化、段位、统计和原子写入。
- `mockjs/`：应优先维护的 ESM 源码。`engine.mjs` 是牌局状态机，`ai.mjs` 是 AI/牌效与计分辅助，`tiles.mjs` 管理实体牌，`shanten.mjs` 管理向听，`pb.mjs` 与 `proto_enum.mjs` 管理协议，`browser_entry.mjs` 是浏览器 bundle 入口，`build_browser.mjs` 是 esbuild 构建脚本。
- `mock/`：原客户端兼容层和本地服务使用的协议/大厅数据模型。`server.js`、`proto.js`、`userdata.js` 提供旧式浏览器兼容代码；`riichi.js` 是由 `mockjs/` 生成的浏览器构建产物，`data.js` 也包含自动生成的数据。
- `offline-patch.js`：在 Unity 初始化前把客户端网络/资源行为接到本地服务的补丁。
- `test/`：Node.js 测试文件，覆盖动作校验、AI、引擎、构建 bundle、本地服务、比赛流程、协议、计分和档案。
- `docs/`：`repair-backlog.md` 记录修复清单，`docs/adr/` 记录本地存档和规则基线等架构决策。
- `userdata/`：运行时生成的本地 `profile.json`，保存昵称、设置、段位、金币和累计战绩；该目录被 Git 忽略。
- `node_modules/`：npm 依赖安装目录；被 Git 忽略。

重要入口是 `start-game.bat`、`local/launcher.mjs`、`local/server.mjs`、`mockjs/engine.mjs`、`mockjs/browser_entry.mjs` 和 `test/*.test.mjs`。

### 4. 代码风格与规范

- 使用项目现有的 ESM 结构：新引擎/服务源码放在 `.mjs`，兼容原客户端的 `mock/*.js` 保持其 IIFE、`globalThis.__mj` 命名空间和浏览器可直接加载的形式。
- 服务层和测试通常使用 2 个空格缩进、单引号、分号和 `camelCase`；常量使用已有的 `UPPER_SNAKE_CASE` 风格。修改旧 `mock/*.js` 时优先保持所在文件的既有风格，不进行无关的全文件格式化。
- 类、函数和变量使用能表达领域含义的英文 `camelCase`；协议字段、消息名、枚举值必须沿用原协议拼写。测试文件使用 `*.test.mjs`，测试名用中文描述行为，断言使用 `node:assert/strict`。
- 实体牌必须使用 `mockjs/tiles.mjs` 定义的牌 ID/牌种转换；不要用字符串或模糊牌种替代实体牌，以免破坏红宝、鸣牌和动作校验。
- 保持分层：`local/server.mjs` 负责进程、HTTP/WebSocket 和存档接线，`mockjs/engine.mjs` 负责权威状态与规则，AI 只依赖自身手牌和公开信息，浏览器 bundle 只从 `mockjs/` 构建。
- 协议改动要同时检查 `mockjs/riichi_desc.mjs`、编码/解码调用方、兼容层和相关回归测试；动作必须先做合法性校验，再提交状态变更。
- 规则争议以 `docs/adr/0002-use-mahjong-soul-ranked-rules.md` 的雀魂段位战规则为唯一基线；存档设计遵循 `docs/adr/0001-filesystem-owned-local-save.md`。
- 修改 `mockjs/` 后运行 `npm run build` 更新 `mock/riichi.js`，再运行 `npm run check` 和 `npm test`。

### 5. 禁止规则（NEVER Rules）

- 🚫 禁止手动修改 `node_modules/`、`userdata/` 中的运行时存档以及 Unity 二进制/压缩构建产物；不要直接手改 `mock/riichi.js`，应修改 `mockjs/` 后执行 `npm run build`。
- 🚫 禁止随意修改 `package-lock.json`；只有新增、删除或升级依赖时，才通过 npm 命令让它与 `package.json` 一起变更。
- 🚫 禁止在代码、HTML、批处理或提交中硬编码真实 API Key、密码、令牌或个人数据；测试凭据必须是明确的 mock 值。
- 🚫 禁止跳过测试、语法检查或 bundle 构建验证直接提交；规则、协议、存档和服务行为的修改必须补充或更新回归测试。
- 🚫 禁止重新接入生产域名、远端 WSS、远端日志或需要联网的游戏流程；本地功能必须通过 `127.0.0.1` 回环服务工作。
- 🚫 禁止把非权威的浏览器状态当作牌局真相，或让 AI 读取对手暗牌、未来牌山和不可见信息。
- 🚫 禁止破坏 `userdata/profile.json` 的原子写入、版本字段和既有档案兼容性；不应把未完成比赛、单场历史或牌谱偷偷写入档案。
- 🚫 禁止把临时截图、`.tmp-*` 调试文件和本地实验输出当作正式源码提交；如确有必要，应先确认其用途和版本管理策略。
- 🚫 禁止为了修复一个问题顺带重写原 Unity 页面、生成数据或无关旧式兼容代码；保持补丁范围最小并保留原界面边界。

### 6. Git 工作流

- 当前默认分支为 `main`，并跟踪远端 `origin/main`；未发现更细的仓库分支策略。✅ 新功能或修复建议从最新 `main` 创建短生命周期功能分支，完成验证后合并，避免直接在 `main` 上积累未验证改动。
- 提交信息推荐使用 Conventional Commits，例如 `fix(engine): 修正三麻拔北抢和`、`test(profile): 增加档案迁移覆盖`、`docs: 更新本地启动说明`。
- 一个提交尽量只完成一个可解释的变更；源码与由源码生成的 `mock/riichi.js` 应在需要时一起提交，依赖变更必须同时包含 `package.json` 和 `package-lock.json`。
- PR 应说明用户可见行为、规则/协议影响、存档兼容性、是否更新生成产物，并列出实际执行的 `npm run check`、`npm test`、`npm run build` 等验证命令及结果。
- PR 不应包含 `node_modules/`、`userdata/`、临时截图/调试文件、未说明的 Unity 构建产物改动或真实敏感信息。涉及规则和离线边界时同步更新 `docs/repair-backlog.md` 或对应 ADR。

### 7. 常见任务指南

#### 添加新依赖

1. 在项目根目录执行 `npm install <包名>`（开发工具使用 `npm install -D <包名>`），不要手工编辑锁文件。
2. 检查 `package.json` 与 `package-lock.json` 的差异，确认依赖用途和 Node.js 22 兼容性。
3. 运行 `npm run check`、`npm test`；若影响浏览器 bundle，再运行 `npm run build` 并复测。

#### 运行单个测试

```bash
node --test test/engine-smoke.test.mjs
node --test --test-name-pattern="固定种子" test/engine-smoke.test.mjs
```

测试本地服务或存档时优先使用测试内的临时目录；不要把测试档案写入项目的 `userdata/`。

#### 调试本地服务与对局

- 运行 `MJ_DEBUG=1 npm start`（Git Bash）启用服务日志；Windows 命令提示符可使用 `set MJ_DEBUG=1 && npm start`。
- 可用 `MJ_PORT=<端口>` 固定服务端口；默认由启动器使用 `MJ_PORT=0`，让操作系统分配空闲端口。
- 可用 `MJ_USERDATA_DIR=<目录>` 将调试存档隔离到临时目录，避免污染正式 `userdata/`；服务会在目录中读写 `profile.json`。
- 服务层支持通过 URL 查询参数 `mjPlayers`、`mjLength`、`mjSeed`、`mjSpeed` 选择人数、比赛长度、随机种子和 AI 速度；优先复用这些现有入口，不新增调试网页。
- 对牌局规则或 AI 的修复，优先在 `mockjs/engine.mjs`、`mockjs/ai.mjs` 和对应 `test/*.test.mjs` 中复现；完成后执行 `npm run build`，再用 `npm start` 做 Windows/浏览器端手测。

#### 修改协议或兼容层

先定位 `mockjs/riichi_desc.mjs`、`mockjs/pb.mjs`、`mock/proto.js`、`mock/server.js` 和对应测试的调用链；同时验证字段编码、真实动作实体牌、错误码和非法动作后的状态不变量。不要通过“未知请求自动成功”掩盖未实现功能。
