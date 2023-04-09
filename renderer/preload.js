const { dialog } = require('electron').remote;
const fs = require('fs');
const marked = require('marked');

window.api = {
  openFile: async () => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });
    const filePath = result.filePaths[0];

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) throw err;

      const html = marked(data);
      window.api.sendToRender('file-opened', { filePath, html });
    });
  },
  sendToRender: (channel, data) => {
    window.webContents.send(channel, data);
  }
};
