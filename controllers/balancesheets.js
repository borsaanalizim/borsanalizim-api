const balanceSheetUtil = require('../utils/balancesheet')
const config = require('../config/config')

async function addBalanceSheets(req, res, next) {
    try {
        const stockCode = req.query.stockCode
        const year = req.query.year
        if(stockCode) {
            await balanceSheetUtil.getBalanceSheetsByStock(stockCode, year)
        } else {
            await balanceSheetUtil.getBalanceSheets(year)
        }
        res.status(200).send("BORSA ANALIZIM - Balance Sheet")
    } catch (error) {
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } })
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