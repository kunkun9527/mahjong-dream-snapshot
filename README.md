# Mahjong Dream Snapshot

《激情麻将/雀梦麻将》关服前快照。正在修复为 Windows 本地单机版。


## 启动游戏

1. 安装 Node.js 22 或更高版本。
2. 双击 [`start-game.bat`](start-game.bat)。
3. 启动器会在本机回环地址运行服务，并优先用 Edge 打开游戏。关闭启动器窗口即可停止服务。

默认启动四麻东风。也可在命令提示符中选择其余正式模式：

```bat
start-game.bat --players=4 --length=east
start-game.bat --players=4 --length=hanchan
start-game.bat --players=3 --length=east
start-game.bat --players=3 --length=hanchan
```

昵称、设置、内容选择、三/四麻段位、金币和累计战绩保存在游戏目录的 `userdata/profile.json`。游戏运行时不需要访问外网。
## 开发

需要 Node.js 22。

```bash
npm install
npm test
npm run build
```

麻将引擎的可维护源码位于 `mockjs/`；`mock/riichi.js` 是浏览器构建产物，请勿直接修改。完整修复计划见 [`docs/repair-backlog.md`](docs/repair-backlog.md)。
