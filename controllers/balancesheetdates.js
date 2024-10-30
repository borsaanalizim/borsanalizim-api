const notificationUtil = require('../utils/notification')

exports.get = async function (req, res, next) {
    try {
        notificationUtil.memberDisclosureQuery()
        res.status(200).send('Bildirimler yükleniyor...')
    } catch (error) {
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } })
    }
}