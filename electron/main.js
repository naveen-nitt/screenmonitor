const { app, BrowserWindow, globalShortcut, desktopCapturer, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 620,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setIgnoreMouseEvents(false);
  mainWindow.loadURL(process.env.NEXT_APP_URL || "http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+Shift+S", () => {
    mainWindow.webContents.send("hotkey-triggered");
  });

  ipcMain.handle("capture-screen", async () => {
    const primaryDisplay = screen.getPrimaryDisplay();

    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: primaryDisplay.size.width,
        height: primaryDisplay.size.height
      }
    });

    const source = sources[0];
    if (!source) return null;

    const dataUrl = source.thumbnail.toDataURL();
    return dataUrl;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
