const notificationUtil = require('../utils/notification')
const config = require('../config/config')

async function addBalanceSheetDates(req, res, next) {
    try {
        const mkkMemberOid = req.query.mkkMemberOid
        notificationUtil.memberDisclosureQuery(mkkMemberOid)
        res.status(200).send('Bildirimler yükleniyor...')
    } catch (error) {
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } })
    }
}

async function deleteAllBalanceSheetDates(req, res, next) {
    try {
        await config.BalanceSheetDate.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        console.error(error)
        res.status(500).send('Hata oluştu:' + error) // Hata mesajını daha kullanıcı dostu hale getirin
    }
}

exports.get = async function (req, res, next) {
    await addBalanceSheetDates(req, res, next)
}