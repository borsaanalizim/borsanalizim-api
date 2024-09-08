const notificationUtil = require('../utils/notification')

exports.get = async function (req, res, next) {
    try {
        await notificationUtil.memberDisclosureQuery()
        res.status(200).json({ message: "BORSA ANALIZIM" })
    } catch (error) {
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } })
    }
}