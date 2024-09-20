const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const stockCode = req.query.stockCode
        const period = req.query.period
        if(stockCode && period) {
            const balanceSheets = await config.BalanceSheet.find({
                stockCode,
                'balanceSheets.period': period
            })
            res.status(200).json({data: balanceSheets})
            console.log("Koşul 1")
            return
        }
        if(stockCode) {
            const balanceSheets = await config.BalanceSheet.find({ stockCode })
            res.status(200).json({data: balanceSheets})
            console.log("Koşul 2")
            return
        }
        if(period) {
            const balanceSheets = await config.BalanceSheet.find({ 'balanceSheets.period': period })
            res.status(200).json({data: balanceSheets})
            console.log("Koşul 3")
            return
        }
        const balanceSheets = await config.BalanceSheet.find()
        res.status(200).json({data: balanceSheets})
        console.log("Koşulsuz")
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}