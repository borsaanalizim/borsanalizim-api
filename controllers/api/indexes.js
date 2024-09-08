const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const indexes = await config.Index.find();
        res.status(200).json({data: indexes})
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}