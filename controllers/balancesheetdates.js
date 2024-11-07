const notificationUtil = require('../utils/notification')
const config = require('../config/config')
const mongoose = require('mongoose');

async function addBalanceSheetDates(req, res, next) {
    try {
        const mkkMemberOid = req.query.mkkMemberOid
        const year = req.query.year
        notificationUtil.memberDisclosureQuery(mkkMemberOid, year)
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

        res.status(200).send("Belirtilen kayıt başarıyla güncellendi.");
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

async function deletePeriodById(req, res, next) {
    try {
        const stockCode = req.query.stockCode;
        const periodId = req.query.periodId;

        if (!stockCode || !periodId) {
            return res.status(400).send("Lütfen geçerli bir stockCode ve periodId belirtin.");
        }

        // ObjectId'yi doğrulayarak işlem yapıyoruz
        const objectId = mongoose.Types.ObjectId(periodId);

        const result = await config.BalanceSheetDate.updateOne(
            { stockCode: stockCode },
            { $pull: { dates: { _id: objectId } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send("Belirtilen period bulunamadı veya silinemedi.");
        }

        // Silme işlemi sonrası kontrol
        const updatedRecord = await config.BalanceSheetDate.findOne(
            { stockCode: stockCode, "dates._id": objectId }
        );

        if (updatedRecord) {
            return res.status(500).send("Silme işlemi başarısız oldu, period hala mevcut.");
        }

        res.status(200).send("Belirtilen period başarıyla silindi.");
    } catch (error) {
        console.error(error);
        res.status(500).send('Hata oluştu:' + error);
    }
}

exports.get = async function (req, res, next) {
    const isUpdate = req.query.isUpdate
    const isDeleteSpesific = req.query.isDeleteSpesific
    const isDeleteAll = req.query.isDeleteAll
    const isDeletePeriodById = req.query.isDeletePeriodById
    if(isUpdate) {
        await updateSpesicifData(req, res, next)
    } else if(isDeleteSpesific) {
        await deleteSpesicifData(req, res, next)
    } else if(isDeleteAll) {
        await deleteAllBalanceSheetDates(req, res, next)
    } else if (isDeletePeriodById) {
        await deletePeriodById(req, res, next);
    } else {
        await addBalanceSheetDates(req, res, next)
    }
}