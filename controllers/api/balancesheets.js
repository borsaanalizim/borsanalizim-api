const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const stockCode = req.query.stockCode
        const period = req.query.period
        if(stockCode && period) {
            const balanceSheets = await config.BalanceSheet.findOne({
                stockCode,
                'balanceSheets.period': period
            })
            res.status(200).json({data: balanceSheets})
            return
        }
        if(stockCode) {
            const balanceSheets = await config.BalanceSheet.findOne({ stockCode })
            res.status(200).json({data: balanceSheets})
            return
        }
        if(period) {
            const balanceSheets = await config.BalanceSheet.find({ 'balanceSheets.period': period })
            res.status(200).json({data: balanceSheets})
            return
        }
        const balanceSheets = await config.BalanceSheet.find()
        res.status(200).json({data: balanceSheets})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}