@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 需要先安装 Node.js 22。
  pause
  exit /b 1
)
for /f "delims=." %%v in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%v"
if %NODE_MAJOR% LSS 22 (
  echo [错误] 当前 Node.js 版本过低，需要 Node.js 22 或更高版本。
  pause
  exit /b 1
)
if not exist "node_modules\ws\package.json" (
  echo 正在安装本地依赖……
  call npm install
  if errorlevel 1 (
    echo [错误] npm install 失败。
    pause
    exit /b 1
  )
)
echo 关闭此窗口即可停止本地游戏服务。
node local\launcher.mjs %*
if errorlevel 1 pause
