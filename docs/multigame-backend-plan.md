# 其他玩法后端恢复计划

状态：已核实四川规则页面与协议资料，已实现普通四川牌形、计分、基础AI，以及5022血战单局权威引擎、荒牌清算和独立计时会话；5022 已接通匹配、局内通道、重连与雀币结算（未做原 UI 人工验收）。此前段位/商店更新已提交并推送为 `c34690b`；独立模块测试通过不代表这些玩法已经可玩。

## 已确认的需求

- 用户将具体顺序交由主代理安排。当前顺序：血战到底 → 普通血流 → 红中血流 → 斗地主 → 掼蛋。每种玩法先完成独立闭环，再推进下一种。
- 复用原 Unity 界面、美术与操作入口，权威状态、合法性校验、AI 和结算由本地 Node.js 服务负责。
- **规则依据**：用户明确要求优先采用原客户端可供玩家阅读的规则说明。符号、枚举、算法或资源名可能是残留，只能用于定位协议/资源，不能单独确立规则。
- 用户已授权主代理核实并统一处理缺失/冲突细则，不必逐项再询问。明确且一致的原说明优先；缺项查可靠资料，无法确定的部分明确标为本地约定，并记录依据、选择理由和回归用例。日麻的雀魂规则不自动扩展到四川或扑克。

## 已核实的后端缺口

- `mock/server.js` 的 `HANDLERS[20403]` 对非立直玩法只回空匹配响应，不创建对应权威牌局。因此不是单纯解除入口限制即可恢复玩法。
- `encTableInfo()`、`getRiichi()`、`HANDLERS[20018]`、断线重放和离桌清理均与 `session.riichi` 耦合；只增加 gameType 白名单会把其他玩法接到错误引擎。
- `local/server.mjs` 的断线托管、重连和 `onFinalResult` 接线目前仅针对日麻。新玩法结算不能写入三麻/四麻段位和战绩。
- `offline-patch.js` 只将已识别的麻将代理 WebSocket 接到回环服务。扑克是否另用代理地址仍需核实；新增路由必须继续阻止外网访问。

## 四川麻将实施门槛

1. 保存原规则文案的资源位置、文本标识与相关摘录；区分血战/血流等变体。没有证据的部分明确标为待确认。
2. 核对换三张、定缺、胡牌后是否退出、过胡、杠与抢杠、一炮多响、番种叠加/封顶、查花猪/查大叫/退税、终局和结算规则。
3. 取得实际匹配入口与请求/响应/通知字段证据，并确认原 UI 所需的准备、交换、定缺、摸打、鸣牌、胡牌和结算事件。枚举存在不等同于可达入口。
4. 上述规则和协议明确后，新增独立四川牌局状态机与适配层。共用回环传输、档案及可验证的底层工具，不在日麻计分器内堆叠四川分支。

## 每种玩法的验收标准

- 一个真人与所需数量的 AI 可以从原入口开始、完成游戏并正常返回大厅。
- AI 只能使用自己的暗牌和公开信息；非法、重复、过期动作不能改变权威状态。
- 覆盖完整局序、不重复实体牌、计分守恒、超时与托管、取消/离桌/重连，以及一次结算只记账一次。
- 真实本地协议会话测试与规则单测分别通过；执行 `npm run build`、`npm run check`、`npm test`，保持已有日麻和商店回归通过。
- Unity 界面操作与演出是否人工验收需单独记录，不能用纯后端测试替代。

## 四川已落实的证据与基础代码

### 原规则页面确实读取的资料

- `tools/extract_sichuan_rules.py` 只读解包同一 commonconfigs 源文件，并用原 IL2CPP `CreateRulesCfg` / `CreateCNYiCfg` 参数验证字段顺序；生成 `mockjs/sichuan_catalog.mjs`。游戏和测试运行不需要 Python。
- `CommonRulesCfgTb` 共23条四川说明：血流5021/血战5022各8条，红中血流5023共7条；关联 `LanguageTbUISC` 原文。不是从算法代码推导规则。
- 主代理补查到 `CommonCNYiCftTb`：血流/血战各33条，红中52条，规则展示项分别27/27/41条。包含倍率、原文、不计番项和牌例。
- 页面调用证据（原 WASM 函数索引）：`UISicRulesInfo1_UpdateInfo` 63085 → `GetRulesCfg` 15088，刷新项63086 → `UIRuleTextItem_Update` 29976，后者读取标题与内容文本。
- 番型页面：`LoadCnYiCfg` 41892读取 `CommonCNYiCftTb`；`UISicRulesInfo2_UpdateInfo` 18195 → `GetCnYiCfg` 41896，刷新项63080 → `UIMjItemCom_Update` 30341。该渲染函数读取零基字段4/5的名称/说明及字段14的 `Bei`，用文本1549 `X{0}倍` 显示；字段由合并getter的FlatBuffers偏移12/14/32核对，不能按合并后的函数名字猜字段。
- 番型公式文本2159为“番型1 x 番型2 x ... x 底分”。血战用牌/胡牌/换三张条目分别502201/502202/502204；普通四川要求同色三张，红中条目502304只写三张手牌，不能混用。

### 不能直接照抄为服务器算法的部分

- 原页面“将三龙七对” `Bei=126`，不是128；生成数据保留原值，不静默修正。
- 部分 `ExceptYis` 存在自引用或跨玩法引用，例如血战七对排除自身、天胡引用502100111。应根据明确“不计”文案及牌形择优实现，而不是直接将原数组当完整算法执行。
- 红中血流文本2750禁止红中单吊，但番型文本2736又说明“红中金钩钓”；两条都保留，红中阶段必须明确补充裁决。
- 过胡、破产和部分支付边界还需补足依据；这些未覆盖分支不能宣称已恢复原服行为。

### 当前代码完成范围

- `mockjs/sichuan_hand.mjs`：108张唯一实体牌，复用 `tiles.mjs` 的ID定义；强制打缺；四面子一将、七对及四张作两对的龙七对分解；保留多解供计分择优；听牌排除自己暗手/副露已占满四张的第五张；拒绝吃牌、非法碰杠和重复实体。
- `mockjs/sichuan_score.mjs`：普通血战/血流的27种可见番型、复合番替代、根、情境番、最终封顶、查大叫最高普通荣和倍率，以及和牌/三类杠费的纯积分转移。补充裁决与边界以 `docs/adr/0004-sichuan-scoring-clarifications.md` 为准；不直接执行原表损坏的互斥引用，也不直接写钱包。
- `mockjs/sichuan_ai.mjs`：换三张、定缺、强制打缺、合法弃牌及碰杠/胡牌响应。只读本人手牌和公开实体牌；四川七对向听单独计算，只复用日麻标准面子向听算法。向听用于排序，不作为权威和牌依据；受入扣除已知牌，不把已打出的牌重新当作可摸牌。
- `mockjs/sichuan_engine.mjs`：固定种子发牌、换三张、定缺、摸打、碰杠、过胡、补杠抢和、多响收齐、已胡退出及最后一张牌边界；非法/过期动作在副本上校验，不部分提交。
- `mockjs/sichuan_settlement.mjs`：荒牌退税、查大叫、花猪与逐笔转移；呼叫转移已用掉的杠款不重复退税。
- `mockjs/sichuan_session.mjs`：单局准备、独立阶段超时、断线AI接管、主动托管、同进程连接替换及一次性结束回调；使用可信连接代次和内部窗口编号。它不是 Unity 协议适配器，也不接钱包或日麻战绩。
- 专项回归：规则目录6项、牌形9项、计分15项、AI9项、协议11项，另有引擎/清算/会话32项。引擎自战逐动作检查108张实体唯一归属和积分守恒；会话覆盖超时强制打缺、非法动作不续时、重连期限保留、旧任务隔离和结束回调只触发一次。
- `mockjs/sichuan_requests.mjs`：独立上行动作适配，严格选择会话当前合法候选；`test/sichuan-requests.test.mjs` 新增11项回归，包含三个种子整局协议封包驱动、逐动作不变量、超时/旧连接、畸形和非请求拒绝。不代表真实WebSocket或Unity下行已接线。
- `mockjs/sichuan_opening_notifications.mjs`：独立开局下行投影，按原 `majiang` 信封生成准备、发牌、换三张与定缺通知；测试新增11项，覆盖三方向×四座位换牌重建、暗牌隐藏、定缺操作、超时、重复更新和遗漏更新拒绝。尚未订阅到真实传输链。
- `mockjs/sichuan_turn_notifications.mjs`：摸牌/普通弃牌事件构造器，白名单投影当时的实体、余牌与候选；11项回归包含三个种子无鸣牌完整单局的四视角手牌重建及真实会话更新。它本身不做事件订阅。
- `mockjs/sichuan_notifications.mjs`：统一消费开局与局中事件，新增13项回归覆盖碰、暗杠/明杠/无人可抢的补杠、自摸、多响、呼叫转移、荒牌退税/查叫及终局；三类房间四视角逐更新重建手牌、副露、已胡状态和余额。抢补杠候选仍明确阻塞，不是完整原UI闭环。
- 本阶段已执行 `npm run build`、`npm run check` 和全部282项测试，均通过；bundle重建后内容未变。规则目录及协议描述符此前已重复提取逐字节一致；Unity资源、运行时存档及依赖锁文件未改动。
- 5022/5021 已接通匹配、原UI通知、重连、离桌与雀币结算（`mockjs/sichuan_table.mjs`、`mock/server.js`，回归见 `test/sichuan-server.test.mjs`）；剩余为原界面人工验收。5021 与 5022 共用局序，按 gameType 区分胡后离场/继续（ADR 0004 普通血流补充约定）；5023红中血流尚无局序实现。

### 已核验的四川协议资料

- 使用 `node tools/extract_majiang_protocol.mjs` 从原WASM、data及symbols三份压缩文件生成 `mockjs/majiang_desc.mjs`；不依赖临时文件、Python或新安装的反编译工具。生成物记录源文件与描述符SHA-256。
- `MajiangReflection__cctor`（105782）按251个字符串槽位组成 `game_logic/majiang/majiang.proto`：67个顶层消息、12个顶层枚举，所有类型引用均可解析。最初子代理报告的66消息版本因第12槽使用 `base - -64` 而被错误排序，已弃用；不能继续沿用其损坏文本schema或缺失的嵌套map定义。
- `mockjs/majiang_pb.mjs` 提供独立地方麻将消息/封包编解码及枚举；保留原大小写字段（如 `ReqSetInternalState.InternalState`），解码64位整数为十进制字符串。编码拒绝未知字段与越界整数，封包拒绝未知/GM事件。此处仅做协议校验，不替代牌局权限和动作合法性校验。
- 上行证据：`MGIMGNetQuestManager_SendGameServerLogicRequest`（107200/107201）写入 `GameServerLogicData` 后调用 `SendDataToServer(20018, ...)`。这是共用RPC编号，不代表日麻和四川使用相同内层schema。
- 封包字段经IL2CPP常量和 `GameServerLogicData.InternalWriteTo`（115514）交叉核对：`cmd:int32=1`、`extraLogicData=2`、`gameNumber:int64=3`、`serialized:bytes=100`；writer标签分别为8、24和两字节162/6。`extraLogicData`暂按不透明bytes保留，其子结构尚未核验。107200/107201上行路径没有设置 `GameNumber`，不能要求客户端用它回传服务端动作窗口编号；其余业务用途仍待核验。
- `test/majiang-protocol.test.mjs` 11项回归覆盖槽位计算、从原资源重复提取、全部引用解析、packed/unpacked牌ID、原字段大小写、嵌套map、64位精度与异常输入。不是实际四川UI会话验收。
- 静态上行核验：`SiCNetQuestManager_PlayCardRequest`（82052）直接写入单张 `card`、`action` 和两个超时标记，发送cmd3；`QiangCardRequest`（82047）复制 `otherCards` 列表并发送cmd5；`DingQueRequest`（82059）直接写入花色并发送cmd9。描述符 `CardType` 为万1/筒2/条3，不套日麻花色索引。

### 上行动作映射与传输边界

| 原请求 | 当前上行适配 |
| --- | --- |
| `ReqPrepare` | 当前连接准备；同一实例不重复开局 |
| `ReqChangeCard` / `ReqDingQue` | 同色三张实际实体集合 / 花色1–3；必须命中当前候选 |
| `ReqPlayCard` | Normal→弃牌，PengGang→补杠，AnGang→暗杠，Hu→自摸；暗杠由单张代表匹配权威四实体候选 |
| `ReqQiangCard` | Guo→过，Peng→碰，MingGang→明杠，Hu→荣和；碰杠严格匹配实体集合，禁止吃牌 |
| 破产/退出/托管/自动开关请求 | 适配层暂回 `Fail_InvalidParam`，未实现前不做假成功；会话本身已具备托管能力 |

`handleSichuanRequest` 仅接受服务端传入的连接代次与窗口上下文；`GameNumber` 和客户端超时标记不授予权限。畸形/非请求没有内层响应，未来外层需统一返回明确失败；未知额外逻辑不部分执行。当前没有RPC响应缓存，不能辨认重新标记为当前窗口的旧封包；接入外层时必须按可信入站序列去重，不能用每次读取最新 `windowId` 冒充完整的重放防护。

### 开局下行投影与静态客户端依据

- 必须在 `session.start()` 前创建 `SichuanOpeningNotifications`，并在每次 `onUpdate` 中读取后交给外层有序发送。按 `NtfToPrepare → 四席NtfPrepare → NtfGameStart → 换牌确认/结束 → 定缺确认/结束` 生成；不换牌房间直接进入定缺。房间接线必须显式传入桌面余额与 `scoreType`，不把零和积分差额冒充钱包余额。
- 原 `SiCMGGameStartState_ProcessMsg`（34276）读取四席手牌和阶段超时；本方发实体牌，他家按13/14张零值背牌隐藏。建议只由本人手牌计算；阶段超时按毫秒向上取整为秒，`chuPai2Timeout=0`，不套用日麻共享延时规则。动画实际耗时与服务端期限的对齐尚需后续接线验证。
- `SiCMGExchangeCardState_ProcessExchangeCardEndMsg`（34283）按数组下标访问四座位并逐张移出/加入手牌，因此换牌结束不能只发真人一行。他家换出/换入均发三个背牌；本人实际收牌来自 `(seat-offset+4)%4`。原方向枚举为顺1/逆2/对3，对应引擎offset的3/1/2，不直接透传offset。
- `SiCMGDingQueCardState_ProcessDingQueCardMsg`（34285）按声明座位索引数组；单人确认隐藏他家花色，`ProcessDingQueCardEndMsg`（34286）收齐后统一公开、更新合法动作和计时。仅真人为庄家时下发其权威操作；第14张已在开局发出，不再伪造一次摸牌。
- 投影输出逐字段白名单，不序列化完整快照；重复读取及连接/托管更新不重发，检测到遗漏准备或多次动作更新时明确失败，不用事后的手牌补造历史。开局完成后不再产生通知，不能把它作为重连快照或完整下行会话。

### 摸打事件构造与静态客户端依据

- `SiCMGSendCardState_ProcessMsg`（34255）按数组下标遍历四席，只有等于通知seat的那一席增加手牌并更新canPlayActions；因此不能只传本人一行。他家摸牌发送0背牌，本人发送精确实体。余牌数由draw事件保存，不读取后续牌山。普通摸牌和杠后尾部补牌均走此通知；补牌前必须先有正确的杠裁决通知。
- `SiCMGPlayingCardState_ProcessMsg`（34272）处理Normal时移出弃牌、更新牌河，按四席数组更新canQiangActions并从开局qiangPaiTimeout建立截止时间；可碰/杠/胡不代表已经裁决，NtfPlayCard中不预扣分、不提前isFinish。摸牌的chuPai2Timeout仍为0，避免重复叠加开局chuPai1Timeout。
- 引擎draw事件保存去重actionTypes；claimWindow保存四席当时的去重候选，不保存候选实体组合。discard事件保存isMoQie，区分同种旧牌、初手、碰后弃牌和真实摸切。事件仍属服务端私有数据；构造器只显示认证本人候选，禁止原样广播四席候选。
- `buildSichuanDiscardNotification`要求discard与紧随其后的同牌同供牌者claimWindow匹配，拒绝把抢补杠窗口冒充普通出牌。两个纯构造器不消费游标、不授权动作、不重置计时；保存旧通知用于测试历史一致性，不等于重连时可以恢复旧操作窗口。
- 不得遍历事件仅过滤摸打后发给客户端；统一顺序由 `SichuanNotifications` 维护。tingInfos仍为空，不伪造听牌提示。

### 碰杠胡与结算下行依据及阻塞

- 原 `SiCMGQiangCardState_ProcessQiangCardMsg`（34265）处理逐席响应，`ProcessQiangCardEndMsg`（34266）才按统一裁决更新副露与胡牌；响应阶段不公开落选者的暗手实体。碰裁决发两张otherCards、明杠发三张，供牌张由此前弃牌通知提供。
- 原 `SiCMGPlayingCardState_ProcessMsg`（34272）对暗杠按牌种移出四张；他家用0隐藏。补杠按已存在的碰追加第四张；自摸先从暗手移出胡牌实体并在独立胡牌区显示。自摸终局handCards因此排除胡牌张，否则重复展示；权威手牌本身不修改。终局显示另核对 `SetupStopUserInfos`（82248）、`SiCPlayerHuCards_Setup`（34203）与 `SiCPlayerHeldCards` 路径。
- 事件保存当次支付增量/累计积分、番型、杠种及碰后动作；moneyLogs逐笔生成，胡牌/杠费不在NtfGameStop重复付款。荒牌退税/查叫/花猪使用清算器的转移记录；局内显示初始余额由调用方明确传入，不是钱包落盘。
- `read()`整批成功才提交游标；未知事件、裁决顺序错误或抢补杠候选均报错，重读不会吞掉阻塞事件。专项13项含四视角自摸终局不重复、逐张副露核对、退款/查叫以及真实计时会话三类房间整局重建；这是Node客户端模型验证，不是Unity实际运行。
- **已按原时序处理：抢补杠副露显示**（下述为当时的分析）。34272会提前把碰改为杠，已核对的34266胡牌裁决未找到对应回退。当前仅无人有候选的补杠可投影；有候选时明确拒绝整批，即使最终都过也不会越过。不能开放入口后再捕获错误跳过通知，也不能禁止合法抢杠掩盖兼容问题。后续须核对取消补杠/重载副露的原协议调用，或验证不提前升级副露的兼容时序，再增加抢和与全过两支回归。

### 下行与大厅接线剩余项

- 5022 接线已完成：匹配沿用 20403/20404/20408/20164/20014（Unity `MatchingViewLogic_QuickPlay_Sic` → `SendRankingMatchRequest`），局内 20018 使用 GameServerLogicData 信封，不进入日麻引擎。待原 UI 实测确认演出与超时字段。

## 已交叉核验的扑克资料

原文来源：`StreamingAssets/Bundles/WebGL/commonconfigs_d005e1531b1cf360239da815293e48c6.bundle`，SHA-256 为 `ed720b8300fcf05a69e59a524562f6d67220697239bcebfe86a2e35a70b0e581`。主代理重新只读解包，确认以下文案同时存在于 `LanguageTbUISC` 与 `LanguageTbUISC1`：

- 文本 2303：“·三人斗地主需要3名玩家参与，用一副牌，地主为一方，其余两家为另一方，双方对战，先出完牌的一方获胜。”
- 文本 2824：“掼蛋通常由四人参与，分成两队。游戏使用两副牌，共108张，每人27张牌。玩家的目标是尽快出完手中的牌。”

这两段可确认基本人数与牌组，但还不足以确定叫分、加倍、牌型比较、级牌、进贡和完整计分；规则页面是否实际引用这些文本仍需在对应玩法阶段核对。

以下专用 UI bundle 已确认存在于 `StreamingAssets/Bundles/WebGL/`，可作为复用线索；文件存在不代表界面已能被当前后端正常驱动：

- 斗地主：`pokerab_ddz_ui_hud_d8c38a28d43f06123f2ac349f8c334da.bundle`、`pokerab_ddz_ui_landlords_43ea8fd14cb4962bee289afbf2bafb42.bundle`。
- 掼蛋：`pokerab_gd_ui_hud_34ddfcea5a1e1c8d7f344fdd36758a8b.bundle`、`pokerab_gd_ui_ingame_dcb95d2dde14adaac165d69b6dd83989.bundle`。
- 公共组件：`pokerab_co_ui_common_728fc39cfd0befc6416dcd90429ac04c.bundle`。

`mock/data.js` 确有 51019/51020 扑克匹配、51021/51022 创建牌桌，以及 51018 开局通知名称；具体字段和调用链仍待核对。现有日麻局内通道为 20018，不能采用“麻将统一走21xxx、四川直接复用日麻消息”的未经证实推断。

斗地主与掼蛋目前只做入口/规则资料盘点；具体实现规则在各自阶段对齐。
