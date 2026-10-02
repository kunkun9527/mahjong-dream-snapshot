# mock/

## Responsibility
原客户端兼容层：以 IIFE 形式挂到 `globalThis.__mj`，既能在浏览器直接加载，也被 `local/server.mjs` 在 Node 中 import。负责外层 wrapper 协议、大厅数据、消息处理器、匹配和对局桥接。

## Key files
- `server.js` — 核心。`Session`、`HANDLERS[msgId]`、`dispatch`、`FakeWebSocket`；匹配 20403（立直、一局战、四川）、对局通道 20018、重连 20162、离桌 20102、商店 100500/100502、用户数据查询 100141。
- `userdata.js` — 大厅用户数据（DT 模块：6 背包道具、30 商店、41/42 段位与档案等）的可变模型；增量通过 wrapper f24 `DataChangeNotify` 回推。
- `proto.js` — 无 schema 的 protobuf wire 编解码（`P.W()` 写、`dict` 读）。
- `data.js` — 抓包得到的初始大厅数据与消息名表（生成数据，不要手改）。
- `riichi.js` — 由 `mockjs/` 经 esbuild 生成的 bundle，**禁止手改**，改 `mockjs/` 后 `npm run build`。

## Flow
`FakeWebSocket.send` → 解 wrapper → `HANDLERS[msgId]` → 返回 `[msgId, payload, type, change]` 列表作为应答（回显 f11 seq）；对局事件经 `sess.push` 异步下推（不带 f11，发送时才分配 f27 序号）。立直走 `__mj.riichi`（`RiichiSession`），四川走 `__mj.sichuan`（`SichuanTable`）。

## Integration
- Depends on: `mock/riichi.js` 导出的 `__mj.riichi/shop/oneRound/sichuan`
- Used by: `local/server.mjs`、`game.html`（纯浏览器模式）、`test/*.test.mjs`

## Gotchas
- 保持 ES5 风格 IIFE（`var`、`function`），不要改成 ESM。
- 保存类请求必须带 f24 增量，客户端才认为成功；100141 要按模块版本收敛，否则客户端会无限重查。
- 未实现的请求返回明确失败，不要伪装成空成功。
- `encTableInfo` 字段号以 `common_define` 为准：5 subType、6 roomType、8 roomID。
- 对局通知帧会缓存用于 20162 重放；已开牌后重放跳过 NtfToPrepare。
