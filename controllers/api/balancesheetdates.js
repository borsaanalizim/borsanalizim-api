const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const balanceSheetDates = await config.BalanceSheetDate.find();
        res.status(200).json({data: balanceSheetDates})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}