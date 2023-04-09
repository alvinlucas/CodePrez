const fs = require('fs')
const { join } = require('path')
const { tmpdir } = require('os')
const unzipper = require('unzipper')

const unzipFile = async (zipPath) => {
  const unzipper = require('unzipper')
  const fs = require('fs')
  const path = require('path')

  const zipDirectory = path.join(path.dirname(zipPath), path.basename(zipPath, '.zip'))

  // Vérifie si le dossier temporaire existe déjà, sinon le crée
  if (!fs.existsSync(zipDirectory)) {
    fs.mkdirSync(zipDirectory)
  }

  // Décompresse le fichier zip
  await fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: zipDirectory }))
    .promise()

    console.log(zipDirectory)
  return zipDirectory
}

module.exports = {
  unzipFile
}
