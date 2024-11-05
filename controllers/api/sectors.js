const config = require("../../config/config")

exports.get = async function(req, res, next) {
    try {
        const sectors = await config.Sector.findOne()
        if (sectors) {
            res.status(200).json({ data: sectors })
        } else {
            res.status(404).json({ error: { message: "Sektör verisi bulunamadı" } })
        }
    } catch (error) {
        res.status(500).json({error: {message: "Bilinmeyen bir hata oluştu", detail: error}})
    }
    
}