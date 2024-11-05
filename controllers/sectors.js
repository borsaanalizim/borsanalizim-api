const config = require("../config/config")
const fileUtil = require('../utils/file')

async function deleteAllSectors(req, res, next) {
    try {
        await config.Sector.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        res.status(500).send('Hata oluştu:' + error)
    }
}

async function addAllSectors(req, res, next) {
    try {
        const sectors = await fileUtil.readJsonFile('storage/sectors.json')

        const newSectors = sectors.map(category => category);

        // Mevcut tek bir belgeye kategorileri ekleyin veya belgeyi oluşturun
        await config.Sector.findOneAndUpdate(
            {},  // İlk belgeyi bul veya yeni belge oluştur
            { $addToSet: { sectors: { $each: newSectors } } },  // Tekrar eden kategorileri önlemek için `$addToSet` kullanın
            { upsert: true, new: true }  // Belge yoksa oluşturun
        );

        res.status(200).send(`${newSectors.length} adet sektör kategorisi eklendi veya güncellendi.`);
    } catch (error) {
        res.status(500).send("Bilinmeyen bir hata oluştu: " + error);
    }
}

exports.get = async function (req, res, next) {
    await addAllSectors(req, res, next)
}