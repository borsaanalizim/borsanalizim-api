const path = require('path')
const fs = require('fs')
const util = require('util')

/**
 * Verilen metni belirtilen dosyaya yazar.
 *
 * @param {string} filePath - Dosya yolu
 * @param {string} data - Yazılacak veri
 * @param {boolean} append - Dosyanın sonuna mı yoksa başına mı yazılacağı (true: ekle, false: üzerine yaz)
 * @returns {Promise<void>}
 */
async function writeFileLog(fileName, data, append = false) {
  const logsDir = path.join(__dirname, '../logs')
  
  // 'logs' klasörünün var olup olmadığını kontrol eder, yoksa oluşturur.
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }

  const filePath = path.join(logsDir, fileName)

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

function getCurrentTimestamp() {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'Europe/Istanbul'
  }).format(new Date());
}

async function logMessage(fileName, message, isError) {
  try {
    const timestamp = getCurrentTimestamp() // Tarih ve saat oluştur
    let messageLog = '' // Tarihi başa ekle
    
    if (isError) {
      messageLog += `Error Log [${timestamp}]:\n\t${util.inspect(message, { depth: null })}\n\n`
    } else {
      messageLog += `Default Log [${timestamp}]:\n\t${message}\n\n`
    }
    await writeFileLog(fileName, messageLog, true)
  } catch (err) {
    console.error(`Write Log File Error: ${err}`)
  }
}

module.exports = { writeFileLog, logMessage }