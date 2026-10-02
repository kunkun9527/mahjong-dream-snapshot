# 项目交接说明（Handoff）

> 面向下一位开发者或 AI agent。本文只记录接手工作所需的当前状态、约束和行动顺序；系统原理详见 [`technical-architecture.md`](technical-architecture.md)，功能完成度详见 [`repair-backlog.md`](repair-backlog.md)。
>
> 最后核对日期：2026-09-12（UTC+8）。此前后端修复已随 `e1d8ae3` 推送至个人仓库 `kunkun9527/mahjong-dream-snapshot`；本次新增一次性段位/货币补给和四类商店修复，提交状态请以 `git status` 为准。

## 1. 先看结论

项目已经从不可维护的浏览器快照恢复为可以构建、测试和本地运行的 Windows 离线麻将游戏：

- Unity WebGL 原客户端继续负责界面；
- Node.js 回环服务负责静态资源、WebSocket、会话和本地档案；
- `mockjs/` 内的可维护源码负责权威牌局、规则、AI、计分和协议；
- 支持四麻/三麻的东风战与半庄；
- 正常运行不应访问外部服务；
- 当前自动化测试为 **286/286 通过**（含四川基础模块、血战单局、上下行投影及 5022 服务接线）；
- 四川血战（5022）已接入匹配、局内 20018、断线托管/重连重放、离桌和雀币结算（输赢减台费，只写雀币，不写日麻段位/战绩）。房间按原表雀币上下限准入，存档雀币较多时只能进乘风及以上。抢补杠抢和成立时原客户端暂显示为杠，终局按权威碰摊牌。5021 血流、5023 红中血流仍未实现。**尚未在原 Unity 页面人工验收。** 详见架构第22章与多玩法计划。
- 先前额外执行过四种模式共 **100 场多 seed 自战**；本轮另将四模式 × 5 种子共 20 场的通知边界不变量检查固化为测试；
- 本轮修复 AI 非法明杠/拔北、食替、流局本场和终局判定、托管竞态、拔北岭上、暗杠红宝及包牌本场，详见 [`backend-audit.md`](backend-audit.md)。
- 后续修复历史“不鸣”设置与当前界面不同步造成的立即过牌；新页面不自动激活历史自动操作，明确提交的开关仍生效。新增会话级吃/碰/杠与 5+20 秒回归，浏览器显示仍需人工复测。
- 新旧档案一次性初始化三四麻七段（17级/2300PT），雀币现有余额×100，其余指定商店货币999999；消费/升降段以后不再补满。用户确认保留原房间上下限，因此七段开放乘风/御龙，不开放低级启航/逐梦。
- 雀币、招募、杂货、荣耀四商店已接入真实扣款/发货/限购/刷新与存档，26项新增回归含真实WS停服重启；修复Windows文件占用导致的原子替换失败。浏览器仍需人工点选验收。
- 维护入口：`local/economy.mjs`、`mockjs/shop.mjs`、`mockjs/economy_catalog.mjs`及`tools/extract_economy_config.py`。生成器需UnityPy/Brotli，游戏运行不需要Python；不直接编辑生成目录或Unity文件。架构及边界见第12章和ADR 0003。

项目尚未“全部完成”。主要剩余工作是 AI 深度、协议级重连快照、外围在线入口禁用、系统化不变量测试和浏览器端完整人工验收。

## 2. 接手后的前 10 分钟

按顺序执行，不要先修改代码。

### 2.1 确认环境

要求 Windows 11、Node.js 22 或更高版本。在项目根目录执行：

```bash
node --version
npm install
npm run check
npm test
```

预期结果：

- Node 主版本不低于 22；
- JavaScript 语法检查通过；
- 286 个测试全部通过。

如果测试数发生变化，以当前测试输出为准，但任何失败都必须先解释，不能通过删除或跳过测试来获得绿色结果。

### 2.2 查看工作区，不要清理

```bash
git status --short
git diff --stat
git diff --check
```

当前工作区相对 HEAD 有大量修改和未跟踪文件。这些不是可随意丢弃的临时改动，包含本地服务、麻将引擎、测试、文档和生成 bundle。

**禁止执行：**

```bash
git reset --hard
git clean -fd
git checkout -- .
```

也不要擅自 stash、提交或拆分现有改动。正式整理提交前，应先由维护者确认提交边界。

### 2.3 建立阅读上下文

依次阅读：

1. [`../CONTEXT.md`](../CONTEXT.md)：产品术语与明确边界；
2. [`adr/0001-filesystem-owned-local-save.md`](adr/0001-filesystem-owned-local-save.md)：本地存档决策；
3. [`adr/0002-use-mahjong-soul-ranked-rules.md`](adr/0002-use-mahjong-soul-ranked-rules.md)：唯一规则基线；
4. [`technical-architecture.md`](technical-architecture.md)：完整技术架构和文件索引；
5. [`repair-backlog.md`](repair-backlog.md)：完成状态与剩余验收项；
6. [`../AGENTS.md`](../AGENTS.md)：开发和验证规范。

恢复四川麻将、斗地主或掼蛋时，另读 [`multigame-backend-plan.md`](multigame-backend-plan.md)：实施顺序、规则证据要求和原 UI 验收门槛。上述日麻规则 ADR 不作为其他玩法的规则说明。

完成标准：能够回答“谁拥有权威状态”“浏览器能否直接改牌局”“档案保存什么”“重连能否跨进程”这四个问题。

## 3. 当前架构边界

### 3.1 单一事实来源

| 领域 | 权威来源 |
| --- | --- |
| 产品定义与术语 | `CONTEXT.md` |
| 规则争议 | `docs/adr/0002-use-mahjong-soul-ranked-rules.md` |
| 存档设计 | `docs/adr/0001-filesystem-owned-local-save.md` |
| 功能完成状态 | `docs/repair-backlog.md` |
| 运行时牌局状态 | `mockjs/engine.mjs` 的 `GameEngine` |
| 持久化状态 | `userdata/profile.json`，由 `local/profile.mjs` 管理 |
| 浏览器 bundle 源码 | `mockjs/`，不是 `mock/riichi.js` |

### 3.2 依赖方向

```text
start-game.bat
  -> local/launcher.mjs
      -> local/server.mjs
          -> local/profile.mjs
          -> mock/*.js
          -> mockjs/browser_entry.mjs
              -> mockjs/engine.mjs
                  -> tiles.mjs / shanten.mjs / ai.mjs / yaku_map.mjs
```

Unity 客户端和浏览器消息都不是牌局真相。所有动作必须由引擎根据当前动作窗口和实体牌进行合法性校验，再提交状态变化。

### 3.3 运行边界

- 服务只监听 `127.0.0.1`；不要改成局域网或公网服务。
- 单进程、单本地档案、单活动页面。
- 页面关闭后由公平 AI 接管并完成比赛。
- 当前重连依赖服务进程内的本局事件回放；服务重启后不能恢复未完成比赛。
- 不保存完整牌谱、单场历史或未完成比赛。
- `Build_intl/` 和移动端不属于当前验收范围。
- 原 Unity 构建产物不可维护，不应为修复 JS 逻辑而改写二进制资源。

## 4. 已完成工作的关键内容

当前工作区中的主要修复包括：

### 工程与服务

- Node.js loopback HTTP/WebSocket 服务和 Windows 一键启动；
- 静态资源 MIME、Brotli、Range、HEAD 与路径穿越防护；
- 单活动 WebSocket 租约和 2 MiB 消息限制；
- 端口占用、资源缺失、浏览器启动失败和损坏存档的中文诊断；
- 外部 WebSocket、fetch、XHR 和 script 请求的离线拦截。

### 会话与协议

- 大厅、匹配、组桌、取消和对局桥接；
- 修复“组桌完成后取消仍幽灵开局”的两级 timer 竞态；
- 未实现请求返回明确非零失败，不再伪装为空成功；
- schema-less Protobuf 的 BigInt、fixed64 和重复字段修复；
- 页面关闭后的公平 AI 接管以及当前进程内重连。

### 麻将规则与比赛

- 四麻/三麻东风战与半庄；
- 权威动作校验、原子动作提交与 5+20 秒操作时限；
- 振听、立直后暗杠、抢杠、抢拔北、多人荣和、包牌、流局满贯；
- 杠宝时机、四杠散了、四家立直、四风连打；
- 三麻牌池、禁吃、拔北、自摸损与宝牌循环；
- 东风南入、半庄西入、飞人、必要点、和了止/听牌止；
- 三四麻独立段位、终局成绩、金币与累计战绩。

### 稳定性与复现

- 显式比赛 seed 驱动牌山、AI、机器人外观和牌桌标识；
- 存档串行写入、唯一临时文件、原子替换和损坏备份；
- 固定 seed 四模式终局测试；
- 额外 100 场多 seed 自战通过。

精确实现位置和调用链不要在本文重复维护，请查阅 [`technical-architecture.md`](technical-architecture.md)。

## 5. 当前未完成事项

以下不是已完成能力。以 [`repair-backlog.md`](repair-backlog.md) 的未勾选项为准。

### 优先级 A：提高回归可信度

1. 补齐规则与计分边界测试；
2. 在每个动作后系统验证：
   - 实体牌总数和唯一归属；
   - 分数加桌面供托守恒；
   - 当前行动者和动作窗口唯一；
   - 非法输入不改变任何状态；
3. 增加固定局面的 AI 能力测试；
4. 完成 Windows 11 上 Edge 和 Chrome 的端到端手测。

这是最适合立即接手的工作，因为它能保护现有大规模未提交修复，又不需要先做新的产品决策。

### 优先级 B：补齐离线产品体验

1. 确认已有角色、服装、语音和牌桌背景的解锁状态一致；
2. 让好友、排行、充值、活动、未接通故事/图鉴等入口明确显示“离线不可用”；
3. 不新增独立网页控制台，不模拟在线服务，不以空成功掩盖缺失功能。

这部分需要先从原客户端行为确认哪些入口可复用，修改前应与维护者对齐交互范围。

### 优先级 C：协议级权威重连快照

使用现有 `Offline2OnlineGameScene` 协议构造当前局面快照，替换当前事件回放。至少需要覆盖：

- 本人手牌和他家手牌数；
- 牌河、副露、分数、局况和牌山余量；
- 宝牌、当前动作窗口和计时；
- `InternalState`；
- AI 接管后真人重新取得操作权的边界。

这是一项跨协议、引擎和会话层的设计工作，开工前应先写字段映射和兼容方案。

### 优先级 D：策略搜索 AI

仍缺少统一候选动作效用、完整牌效、防守、押引、终局顺位策略和固定预算搜索。硬性约束：

- 只读自身手牌和公开信息；
- 相同状态与 seed 必须确定复现；
- 通常 1 秒内、最迟 2 秒内完成一次决策；
- 所有选择仍须经过引擎合法动作集合；
- 不因角色或外观改变棋力。

这不是适合顺手重写的模块。开始前应先确定评估函数、节点预算和验收局面。

## 6. 推荐的下一项工作

推荐先做“逐动作全局不变量测试”，而不是立即扩展功能。

### 建议步骤

1. 找出 `GameEngine` 中所有公开动作提交入口；
2. 编写只观察状态、不修改状态的测试辅助函数；
3. 对摸牌、弃牌、吃、碰、明杠、暗杠、加杠、拔北、立直、荣和、自摸和流局逐一调用；
4. 在动作前后检查实体牌、分数/供托、行动者和窗口；
5. 对每类非法输入保存状态快照并断言深度不变；
6. 运行四种模式固定 seed 自战，确保辅助检查不会误报。

### 完成标准

- 新测试能在故意复制一张实体牌时失败；
- 新测试能在故意产生两个同时有效动作窗口时失败；
- 新测试能检测非法动作造成的部分状态提交；
- 四种正式模式全部通过；
- `npm run build`、`npm run check`、`npm test`、`git diff --check` 全部通过。

## 7. 修改规则

### 必须遵守

- 修改 `mockjs/` 后执行 `npm run build`，把生成的 `mock/riichi.js` 一并纳入验证；
- 动作必须先校验，再修改权威状态；
- 协议改动同时检查描述、编码/解码、调用方和回归测试；
- 存档 schema 改动必须提升版本并提供兼容迁移；
- AI 不得读取对手暗牌或未来牌山；
- 新功能不得重新接入任何生产域名、远端 WSS 或日志服务；
- 测试存档只能写临时目录，不能污染 `userdata/`；
- 保持补丁最小，不做无关格式化或重写。

### 禁止直接修改

- `node_modules/`；
- `userdata/` 中的真实运行时档案；
- `Build/`、`Build_intl/`、`StreamingAssets/` 中的 Unity 二进制或压缩资源；
- 自动生成的 `mock/riichi.js`（应修改 `mockjs/` 后重新构建）；
- `package-lock.json`，除非确实通过 npm 增删或升级依赖。

## 8. 常用命令

```bash
# 完整验证；改过 mockjs/ 时按此顺序
npm run build
npm run check
npm test
git diff --check

# 运行单个测试文件
node --test test/engine-smoke.test.mjs

# 按测试名筛选
node --test --test-name-pattern="固定种子" test/engine-smoke.test.mjs

# 正式启动
npm start

# Windows 一键启动并指定模式
start-game.bat --players=4 --length=east
start-game.bat --players=4 --length=hanchan
start-game.bat --players=3 --length=east
start-game.bat --players=3 --length=hanchan

# 隔离调试档案（Git Bash）
MJ_DEBUG=1 MJ_USERDATA_DIR=.tmp-userdata npm start
```

可用 URL/环境参数和诊断接口详见架构文档第 17 节。

## 9. 故障定位顺序

| 症状 | 先检查 |
| --- | --- |
| 页面打不开或资源加载失败 | `start-game.bat`、`local/launcher.mjs`、`local/server.mjs` |
| 外网请求、WebSocket 地址异常 | `offline-patch.js`、`game.html` |
| 大厅按钮无响应或响应字段错误 | `mock/server.js`、`mock/proto.js`、`mock/userdata.js` |
| 进桌、重连或取消匹配异常 | `mock/server.js` 的 timer/token/table 状态、`local/server.mjs` 的 WS 生命周期 |
| 非法出牌、鸣牌或状态错乱 | `mockjs/engine.mjs` 的动作窗口和实体牌校验 |
| 向听、等待牌或 AI 弃牌异常 | `mockjs/shanten.mjs`、`mockjs/ai.mjs`、`mockjs/tiles.mjs` |
| 役种、符数或点数异常 | `mockjs/ai.mjs` 的计分适配、`mockjs/yaku_map.mjs`、底层 `riichi` 输入 |
| 重启后资料丢失 | `local/profile.mjs`、`local/server.mjs` 的 `saveChain` |
| 浏览器行为与 Node 测试不同 | 是否忘记执行 `npm run build` 更新 `mock/riichi.js` |

## 10. 交付前检查清单

每个后续任务结束时，应报告实际执行结果，而不是只说“理论上通过”。

- [ ] 改动只覆盖当前任务；
- [ ] 新行为有成功路径和失败路径测试；
- [ ] 非法动作后的状态不变量有断言；
- [ ] 修改 `mockjs/` 后已重新构建 bundle；
- [ ] `npm run check` 通过；
- [ ] `npm test` 全部通过；
- [ ] `git diff --check` 通过；
- [ ] 未改 Unity 二进制、真实存档或依赖目录；
- [ ] 未新增外部网络访问；
- [ ] 更新了 `repair-backlog.md` 中对应项，但没有把部分完成写成全部完成；
- [ ] 报告中说明存档兼容性、协议影响和生成物是否变化。

## 11. 当前工作区提示

截至本文核对时，Git 状态包含：

- 已修改：`README.md`、`game.html`、`index.html`、`mock/proto.js`、`mock/riichi.js`、`mock/server.js`、`mock/userdata.js`、`offline-patch.js`；
- 未跟踪：`.gitignore`、`AGENTS.md`、`CONTEXT.md`、`docs/`、`local/`、`mockjs/`、`package.json`、`package-lock.json`、`start-game.bat`、`test/` 等。

该列表只是交接时快照，不是提交建议。下一位接手者应重新运行 `git status --short`，并把维护者的本地改动视为不可覆盖资产。

## 12. 交接完成条件

下一位接手者完成以下动作后，即可认为已正确接管：

1. 阅读第 2.3 节列出的文档；
2. 确认当前测试基线；
3. 确认没有清理或覆盖未提交工作区；
4. 从 backlog 选择一个边界清晰的事项；
5. 对涉及产品、协议或架构的关键方案先完成需求对齐；
6. 为该事项写出可验证的完成标准，再开始编码。
