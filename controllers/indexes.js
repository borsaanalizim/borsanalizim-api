const config = require('../config/config')
const fileUtil = require('../utils/file')

async function deleteAllIndexes(req, res, next) {
    try {
        await config.Index.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        res.status(500).send('Hata oluştu:' + error)
    }
}

async function addAllIndexes(req, res, next) {
    try {
        const indexCategories = await fileUtil.readJsonFile('storage/index_category.json')
        const existingCodes = await config.Index.find().distinct('code');
        const newIndexes = indexCategories.filter(item => !existingCodes.includes(item.code));

        if (!newIndexes.length) {
            return res.status(200).send("Tüm endeks kategorileri zaten kayıtlı.");
        }

        await config.Index.insertMany(newIndexes);
        res.status(200).send(`${newIndexes.length} adet endeks kategorisi eklendi.`);
    } catch (error) {
        res.status(500).send("Bilinmeyen bir hata oluştu: " + error);
    }
}

exports.get = async function (req, res, next) {
    await addAllIndexes(req, res, next)
};

