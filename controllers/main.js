const config = require("../config/config")


exports.get = function (req, res, next) {
    try {
        res.status(200).json({ message: "BORSA ANALIZIM API" })
    } catch (error) {
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } })
    }
}