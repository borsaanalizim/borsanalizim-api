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

async function deleteSpesicifData(req, res, next) {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).send("Lütfen geçerli bir ID belirtin.");
        }

        // ID'ye göre kayıt silme işlemi
        const result = await BalanceSheetDate.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send("Silinecek kayıt bulunamadı.");
        }

        res.status(200).send("Belirtilen kayıt başarıyla silindi.");
    } catch (error) {
        console.error(error)
        res.status(500).send('Hata oluştu:' + error) // Hata mesajını daha kullanıcı dostu hale getirin
    }
}

exports.get = async function (req, res, next) {
    await addBalanceSheetDates(req, res, next)
}