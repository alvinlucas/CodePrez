const { app, BrowserWindow, Menu, dialog } = require('electron');
const { importCodePrez } = require("./script/importCodePrez.js");
const path = require('path');


let currentWin = null;

// Création d'une fenêtre de navigateur
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Chargement du fichier HTML principal
  win.loadFile('renderer/index.html');
  currentWin = win;
  return win;
}

const mainMenu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Open folder',
        accelerator: 'Ctrl+O',
        click: importCodePrez
      },
      {
        label: 'Save',
        accelerator: 'Ctrl+S',
      },
      ...(process.env.NODE_ENV === 'production' ? [] : [{ role: 'toggleDevTools' }, { role: 'reload' }])
    ],
  },
]);

Menu.setApplicationMenu(mainMenu);

// Code à exécuter lorsque l'application est prête
const initialize = async () => {
  await app.whenReady();
  createWindow();
}

initialize();


app.on('activate', () => {
  createWindow();
});


// Quitter l'application lorsque toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
