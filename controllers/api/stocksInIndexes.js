const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const stockIndexes = await config.StockIndex.find();
        res.status(200).json({data: stockIndexes})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}