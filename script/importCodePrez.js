const { dialog, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')
const { unzipFile } = require('./unzip.js')

const importCodePrez =  async() => {
  // Ouvre une boîte de dialogue pour sélectionner un fichier .codePrez
  const selectedFile = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow,{
    filters: [
      {  extensions: ['codeprez'] }
    ],
    properties: ['openFile']
    
  });

  // Vérifie si un fichier a été sélectionné
  if (!selectedFile.canceled) {
    
  

  // Crée un dossier temporaire pour extraire le fichier .codePrez

  const filePaths = selectedFile.filePaths[0]
  const fileName = path.basename(filePaths, '.codeprez')
  const zipPath = path.join(path.dirname(filePaths), `${fileName}.zip`)	
  const zipDirectory = await unzipFile(zipPath)
  console.log(zipDirectory)
  const zipFiles = await fs.readdirSync(zipDirectory)

  
  // Extrait les fichiers .md, .css et .json de zipFiles
  const mdFiles = zipFiles.filter(file => path.extname(file) === '.md')
  const cssFiles = zipFiles.filter(file => path.extname(file) === '.css')
  const jsonFiles = zipFiles.filter(file => path.extname(file) === '.json')

  // Construit le chemin vers les fichiers .md, .css et .json
  const mdPath = path.join(zipDirectory, mdFiles[0])
  const cssPath = path.join(zipDirectory, cssFiles[0])
  const jsonPath = path.join(zipDirectory, jsonFiles[0])

  // Recupère le contenu du fichiers .md
  const fileContent = await fs.readFileSync(mdPath, 'utf8')
  
  const listSection = []

  // Découpe le contenu du fichier content.md en diapositives et englobe chaque segment dans une balise <section>
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    langPrefix: 'language-',
    breaks: false,
    linkify: true,
    typographer: true,
    quotes: '“”‘’```',
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code><div>${hljs.highlight(lang, code, true).value}</div></code></pre>`;
        } catch (__) {}
      }
      return `<pre class="hljs"><code><div>${md.utils.escapeHtml(code)}</div></code></pre>`;
    }
  });


  const sections = fileContent.split('\n\n---\n\n')
    .map((sectionContent) => {
     const section = md.render(sectionContent)
     const sectionWithTags = `<section>${section}</section>`
     listSection.push(sectionWithTags)
    });
  


BrowserWindow.getFocusedWindow().webContents.send('importCodePrez', {sections: listSection, cssPath: cssPath})

  }
}

module.exports = {
  importCodePrez
}
