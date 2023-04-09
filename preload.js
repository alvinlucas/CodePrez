const {contextBridge, ipcRenderer} = require("electron");


contextBridge.exposeInMainWorld("api", {
  importCodePrez: (callback) => {
    ipcRenderer.once("importCodePrez", (event, arg) => {
      callback(arg);
    });
    ipcRenderer.send("importCodePrez");
  } 
});
  