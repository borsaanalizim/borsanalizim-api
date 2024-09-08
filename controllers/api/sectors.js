const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const sectors = await config.Sector.find();
        res.status(200).json({data: sectors})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}