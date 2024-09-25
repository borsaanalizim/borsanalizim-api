const balanceSheetUtil = require('../utils/balancesheet')
const config = require('../config/config')

async function addBalanceSheets(req, res, next) {
    try {
        const stockCode = req.query.stockCode
        const year = req.query.year
        if(stockCode) {
            balanceSheetUtil.getBalanceSheetsByStock(stockCode, year)
            res.status(200).send("BORSA ANALIZIM - Balance Sheet - " + stockCode)
        } else {
            balanceSheetUtil.getBalanceSheets(year)
            res.status(200).send("BORSA ANALIZIM - Bilanço isteği yapıldı, yaklaşık 10 dakika sonra tamamlanacaktır.")
        }
    } catch (error) {
        res.status(500).json("Bilinmeyen bir hata oluştu: " + error)
    }
}

async function deleteAllBalanceSheets(req, res, next) {
    try {
        await config.BalanceSheet.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        console.error(error)
        res.status(500).send('Hata oluştu:' + error) // Hata mesajını daha kullanıcı dostu hale getirin
    }
}

exports.get = async function (req, res, next) {
    await addBalanceSheets(req, res, next)
}