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
        const indexCategories = await fileUtil.readJsonFile('storage/sector_category.json')
        const findPromises = indexCategories.map(item => config.Sector.findOne({ mainCategory: item.mainCategory }));

        const existingSectors = await Promise.all(findPromises);

        const newSectors = indexCategories.filter(item => !existingSectors.some(sector => sector && sector.mainCategory === item.mainCategory));

        await Promise.all(newSectors.map(async sector => {
            const newSectorObj = new config.Sector(sector);
            await newSectorObj.save();
        }));

        res.status(200).send(`${newSectors.length} adet sektör kategorisi eklendi.`);
    } catch (error) {
        res.status(500).send("Bilinmeyen bir hata oluştu: " + error);
    }
}

exports.get = async function (req, res, next) {
    await addAllSectors(req, res, next)
}