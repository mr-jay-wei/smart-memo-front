// electron/main.cjs

// 使用 CommonJS 的 "require" 语法，这对于 .cjs 文件是100%正确的
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// 从应用自身获取版本号 (专业方式)
const appVersion = app.getVersion();

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // __dirname 在 .cjs 文件中可以直接使用，非常可靠
      preload: path.join(__dirname, "preload.cjs"),
    },
    // icon: path.join(__dirname, 'icon.ico') // 同样，图标路径也是安全的
  });

  const devUrl = "http://localhost:5173";
  const isDev = process.defaultApp;

  if (isDev) {
    win.loadURL(devUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.setMenu(null);
}

app.whenReady().then(createWindow);

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
  console.log("主进程收到请求，正在返回版本号...");
  return appVersion;
});
