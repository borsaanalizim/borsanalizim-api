const config = require("../../config/config")
const notificationUtil = require('../../utils/notification')

exports.get = async function(req, res, next) {
    try {
        const stockCode = req.query.stockCode
        const mkkMemberOid = req.query.mkkMemberOid
        if(stockCode && mkkMemberOid) {
            await notificationUtil.memberDisclosureQuery(mkkMemberOid)
            const balanceSheetDates = await config.BalanceSheetDate.findOne({ stockCode });
            res.status(200).json({data: balanceSheetDates})
            return
        }
        const balanceSheetDates = await config.BalanceSheetDate.find();
        res.status(200).json({data: balanceSheetDates})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}