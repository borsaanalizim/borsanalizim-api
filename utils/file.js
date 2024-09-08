const fs = require('fs')

/**
 * Belirtilen JSON dosyasını okur ve içeriğini bir nesne olarak döndürür.
 *
 * @param {string} filePath - JSON dosyasının yolu
 * @returns {Promise<object>}
 */
async function readJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                try {
                    const jsonData = JSON.parse(data)
                    resolve(jsonData)
                } catch (parseError) {
                    reject(parseError)
                }
            }
        })
    })
}

module.exports = { readJsonFile }