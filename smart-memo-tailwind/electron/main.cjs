// electron/main.cjs
const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const fs = require("fs");

const pkg = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
);
const appVersion = pkg.version;

function createWindow() {
  const preloadPath = path.join(__dirname, "preload.cjs"); // 👈 注意后缀名
  console.log(`[主进程] 正在加载 Preload 脚本, 路径: ${preloadPath}`);

  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = "http://localhost:5173";
  const isDev = process.defaultApp;

  if (isDev) {
    win.loadURL(devUrl);
    //win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.setMenu(null);
}

app.whenReady().then(() => {
  // if (process.defaultApp) {
  //   session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //     callback({
  //       responseHeaders: {
  //         ...details.responseHeaders,
  //         "Content-Security-Policy": ["script-src 'self' 'unsafe-inline'"],
  //       },
  //     });
  //   });
  // }
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("get-version", () => {
  console.log("[主进程] 收到了渲染进程的请求，正在返回版本号...");
  return appVersion;
});
