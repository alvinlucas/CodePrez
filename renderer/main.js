const { ipcRenderer } = require('electron');

const markdownContainer = document.getElementById('markdown-container');
const openFileButton = document.getElementById('open-file-button');

openFileButton.addEventListener('click', () => {
  window.api.openFile();
});

ipcRenderer.on('file-opened', (event, data) => {
  const { filePath, html } = data;

  markdownContainer.innerHTML = html;

  document.title = `Markdown Editor - ${filePath}`;

  window.api.sendToRender('file-opened', { filePath, html });

  
});