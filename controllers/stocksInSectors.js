const config = require('../config/config')
const fileUtil = require('../utils/file')
const stocUtil = require('../utils/stock')

async function deleteAllStocksInSectors(req, res, next) {
    try {
        await config.StockSector.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        res.status(500).send('Hata oluştu:' + error)
    }
}

async function addAllStocksInSectors(req, res, next) {
    try {
        const sectors = await fileUtil.readJsonFile('storage/sector.json')
        const existingSectors = await config.StockSector.find().distinct('category');

        // Yeni eklenecek sektörleri filtrele
        const newSectors = sectors.filter(item => !existingSectors.includes(item.category));

        if (!newSectors.length) {
            return res.status(200).send("Tüm sektörler zaten kayıtlı.");
        }

        // Yeni sektörleri ve hisse senetlerini hazırla
        const preparedSectors = newSectors.map(sector => ({
            category: sector.category,
            stocks: sector.stocks.map(stock => ({ code: stocUtil.getSingleStockCodeString(stock.code), name: stock.name }))
        }));

        // Yeni sektörleri toplu olarak ekle
        await config.StockSector.insertMany(preparedSectors);

        res.status(200).send(`${newSectors.length} adet sektör eklendi.`);
    } catch (error) {
        res.status(500).send("Bilinmeyen bir hata oluştu: " + error);
    }
}

exports.get = async function (req, res, next) {
    await addAllStocksInSectors(req, res, next)
}