const { contextBridge, ipcRenderer } = require("electron");

let hotkeyListener = null;

contextBridge.exposeInMainWorld("electronAPI", {
  captureScreen: () => ipcRenderer.invoke("capture-screen"),
  onHotkeyTriggered: (callback) => {
    hotkeyListener = () => callback();
    ipcRenderer.on("hotkey-triggered", hotkeyListener);
  },
  removeHotkeyHandler: () => {
    if (hotkeyListener) {
      ipcRenderer.removeListener("hotkey-triggered", hotkeyListener);
      hotkeyListener = null;
    }
  }
});
