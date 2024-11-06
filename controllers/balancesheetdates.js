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

async function updateSpesicifData(req, res, next) {
    try {
        const stockCode = req.query.stockCode;
        const period = req.query.period;
        const newPrice = req.query.newPrice;

        // Gerekli parametrelerin olup olmadığını kontrol edin
        if (!stockCode || !period || !newPrice) {
            return res.status(400).send("Lütfen geçerli bir stockCode, period ve newPrice belirtin.");
        }

        // Veritabanında belirtilen stockCode ile eşleşen ve "dates.period" alanı "2023/9" olan kaydı bulur ve günceller
        const result = await config.BalanceSheetDate.updateOne(
            { stockCode: stockCode, "dates.period": period },
            { $set: { "dates.$.price": newPrice, lastUpdated: new Date() } }
        );

        if (result.nModified === 0) {
            return res.status(404).send("Belirtilen kayıt bulunamadı veya güncellenmedi.");
        }

        res.status(200).send("Belirtilen kayıt başarıyla silindi.");
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

        // ID'yi ObjectId formatına çeviriyoruz
        const objectId = await mongoose.Types.ObjectId(id);

        // ID'ye göre kayıt silme işlemi
        const result = await config.BalanceSheetDate.findByIdAndDelete(objectId);

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