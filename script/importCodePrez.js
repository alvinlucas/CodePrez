const { dialog, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const { app } = require('electron')

const importCodePrez = () => {
  // Ouvre une boîte de dialogue pour sélectionner un fichier .codePrez
  const selectedFile = dialog.showOpenDialogSync({
    filters: [
      { name: 'codePrez', extensions: ['codePrez'] }
    ]
  })

  // Vérifie si un fichier a été sélectionné
  if (!selectedFile || selectedFile.length === 0) {
    return
  }

  // Crée un dossier temporaire pour extraire le fichier .codePrez
  const tempFolder = app.getPath('temp')
  const folderName = `codePrez_${Date.now()}`
  const folderPath = path.join(tempFolder, folderName)
  fs.mkdirSync(folderPath)

  // Copie le contenu du fichier .codePrez dans un fichier content.md dans le dossier temporaire
  const contentPath = path.join(folderPath, 'content.md')
  const fileContent = fs.readFileSync(selectedFile[0], 'utf-8')
  fs.writeFileSync(contentPath, fileContent)

  // Copie les styles du fichier .codePrez dans un fichier styles.css dans le dossier temporaire
  const cssPath = path.join(folderPath, 'styles.css')
  const stylesStartIndex = fileContent.indexOf('/* styles */')
  if (stylesStartIndex !== -1) {
    const styles = fileContent.slice(stylesStartIndex)
    fs.writeFileSync(cssPath, styles)
  }

  // Ouvre le fichier content.md dans une nouvelle fenêtre
  const contentWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  contentWindow.loadFile('public/index.html', {
    query: {
      contentPath,
      cssPath
    }
  })

  // Nettoie le dossier temporaire
  contentWindow.on('closed', () => {
    fs.rmdirSync(folderPath, { recursive: true })
  })
}

module.exports = {
  importCodePrez
}
