const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const stocks = await config.Stock.find();
        res.status(200).json({data: stocks})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}