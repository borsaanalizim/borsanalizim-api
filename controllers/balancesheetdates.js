const notificationUtil = require('../utils/notification');
const config = require('../config/config');
const mongoose = require('mongoose');

async function addBalanceSheetDates(req, res, next) {
    try {
        const mkkMemberOid = req.query.mkkMemberOid;
        const year = req.query.year;

        res.status(200).send('Bildirimler yükleniyor...');
        
        if (mkkMemberOid && year) {
            await notificationUtil.memberDisclosureQuery(mkkMemberOid, year);
        } else {
            const stocks = await config.Stock.find();
            for (const stockItem of stocks) {
                await notificationUtil.memberDisclosureQuery(stockItem.mkkMemberOid, year);
            }
        }
    } catch (error) {
        console.error(`Add Balance Sheet Dates Error: ${error}`)
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } });
    }
}

async function deleteAllBalanceSheetDates(req, res, next) {
    try {
        await config.BalanceSheetDate.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        console.error(error)
        res.status(500).send('Hata oluştu:' + error)
    }
}

async function updateSpesicifData(req, res, next) {
    try {
        const stockCode = req.query.stockCode;
        const period = req.query.period;
        const newPrice = req.query.newPrice;

        if (!stockCode || !period || !newPrice) {
            return res.status(400).send("Lütfen geçerli bir stockCode, period ve newPrice belirtin.");
        }

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

async function updateSpesicifDataByPeriod(req, res, next) {
    try {
        const stockCode = req.query.stockCode;
        const lastPrice = req.query.lastPrice;
        const period = req.query.period;
        const publishedAt = req.query.publishedAt;
        const price = req.query.price;

        // Gerekli parametrelerin olup olmadığını kontrol edin
        if (!stockCode || !period || !price || !publishedAt) {
            return res.status(400).send("Lütfen geçerli bir stockCode, period, publishedAt ve price belirtin.");
        }

        const balanceSheetDate = await config.BalanceSheetDate.findOne({ stockCode });

        if (!balanceSheetDate) {
            return res.status(404).send("Belirtilen kayıt bulunamadı veya güncellenmedi.");
        }

        if (lastPrice) {
            balanceSheetDate.lastPrice = lastPrice
        }
        balanceSheetDate.dates.push({ period, publishedAt, price });
        await balanceSheetDate.save();

        res.status(200).send("Belirtilen kayıt başarıyla güncellendi.");
    } catch (error) {
        console.error(`Update Spesicif Data By Period Error: ${error}`)
        res.status(500).send('Hata oluştu:' + error)
    }
}

async function deleteSpesicifData(req, res, next) {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).send("Lütfen geçerli bir ID belirtin.");
        }

        // ID'yi ObjectId formatına çeviriyoruz
        const objectId = new mongoose.Types.ObjectId(id);

        // ID'ye göre kayıt silme işlemi
        const result = await config.BalanceSheetDate.findByIdAndDelete(objectId);

        if (!result) {
            return res.status(404).send("Silinecek kayıt bulunamadı.");
        }

        res.status(200).send("Belirtilen kayıt başarıyla silindi.");
    } catch (error) {
        console.error(error)
        res.status(500).send('Hata oluştu:' + error)
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
        const objectId = new mongoose.Types.ObjectId(periodId);

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
    const { isUpdate, isUpdateByPeriod, isDeleteSpesific, isDeleteAll, isDeletePeriodById } = req.query;
    if (isUpdate) await updateSpesicifData(req, res, next);
    else if (isUpdateByPeriod) await updateSpesicifDataByPeriod(req, res, next);
    else if (isDeleteSpesific) await deleteSpesicifData(req, res, next);
    else if (isDeleteAll) await deleteAllBalanceSheetDates(req, res, next);
    else if (isDeletePeriodById) await deletePeriodById(req, res, next);
    else await addBalanceSheetDates(req, res, next);
};