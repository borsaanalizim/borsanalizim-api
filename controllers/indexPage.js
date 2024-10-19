const notificationUtil = require('../utils/notification')
const path = require('path')

exports.get = async function (req, res, next) {
    try {
        // await notificationUtil.memberDisclosureQuery()
        res.sendFile(path.join(__dirname + '/../views', 'index.html'))
    } catch (error) {
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } })
    }
}