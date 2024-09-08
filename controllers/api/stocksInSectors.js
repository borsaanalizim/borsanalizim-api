const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const stockSectors = await config.StockSector.find();
        res.status(200).json({data: stockSectors})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}