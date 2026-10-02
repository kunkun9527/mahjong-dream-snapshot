# tools/

## Responsibility
只读提取脚本：从原 Unity bundle 和 IL2CPP 元数据还原配置与协议，生成 `mockjs/` 下的数据文件。运行时不使用。

## Key files
- `extract_economy_config.py` — 段位 PT 表、四类商店、一局战奖励 → `mockjs/economy_catalog.mjs`。
- `extract_sichuan_rules.py` — 四川规则、番型、房间（MatchSeparateCfg）→ `mockjs/sichuan_catalog.mjs`。
- `extract_majiang_protocol.mjs` — 从 MajiangReflection 还原 majiang.proto → `mockjs/majiang_desc.mjs`。

## Flow
`StreamingAssets/` bundle（FlatBuffers）/ `Build/` 元数据 → 脚本按核验过的字段顺序解析 → 写 `.mjs` 数据（附来源哈希）。

## Gotchas
- Python 脚本需要开发机已装 UnityPy、Brotli；用 `python -B` 运行。
- 字段顺序来自 IL2CPP v31 `Create*Cfg` 参数（MethodDefinition 36 字节）；遇到未知结构应失败，不要猜字段。
- 不修改 Unity bundle；改脚本后重新生成并跑 `npm test`。
