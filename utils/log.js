const fs = require('fs')

/**
 * Verilen metni belirtilen dosyaya yazar.
 *
 * @param {string} filePath - Dosya yolu
 * @param {string} data - Yazılacak veri
 * @param {boolean} append - Dosyanın sonuna mı yoksa başına mı yazılacağı (true: ekle, false: üzerine yaz)
 * @returns {Promise<void>}
 */
async function writeFileLog(filePath, data, append = false) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, { flag: append ? 'a' : 'w' }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function logMessage(filePath, message) {
  try {
    await writeFileLog(filePath, message + '\n', true) // Dosyanın sonuna ekle
    console.log('Mesaj başarıyla loglandı.')
  } catch (err) {
    console.error('Hata oluştu:', err)
  }
}

module.exports = { writeFileLog, logMessage }