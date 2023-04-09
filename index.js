const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

let currentWin = null;

// Fonction pour ouvrir un dossier et extraire un fichier .codePrez
const openFolder = async () => {
  const result = await dialog.showOpenDialog(currentWin, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled) {
    const folderPath = result.filePaths[0];
    const files = fs.readdirSync(folderPath);
    
    // Recherche du fichier .codePrez dans le dossier sélectionné
    const prezFile = files.find((file) => path.extname(file) === '.codePrez');

    if (prezFile) {
      const tempFolder = app.getPath('temp');
      const folderName = `codePrez_${Date.now()}`;
      const folderPath = path.join(tempFolder, folderName);

      fs.mkdirSync(folderPath);

      const zipPath = path.join(folderPath, prezFile);
      const contentPath = path.join(folderPath, 'content.md');
      const cssPath = path.join(folderPath, 'styles.css');

      fs.copyFileSync(path.join(folderPath, prezFile), zipPath);

      // Extraction du contenu du fichier .codePrez dans le dossier temporaire
      const zip = new AdmZip(zipPath);
      zip.extractEntryTo('content.md', folderPath, false, true);
      zip.extractEntryTo('styles.css', folderPath, false, true);

      const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
      });

      window.loadFile('index.html', {
        query: {
          contentPath,
          cssPath
        }
      });

      window.on('closed', () => {
        fs.rmSync(folderPath, { recursive: true });
      });
    }
  }
}

// Création d'une fenêtre de navigateur
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // Chargement du fichier HTML principal
  win.loadFile('public/index.html');
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
        click: openFolder
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
