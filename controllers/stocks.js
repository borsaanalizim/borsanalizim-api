const config = require('../config/config')
const stockUtil = require('../utils/stock')
const fileUtil = require('../utils/file')

async function addAllStocks(req, res, next) {
    try {
        const stocks = await fileUtil.readJsonFile('storage/stock.json')

        for (const item of stocks) {
            const code = stockUtil.getSingleStockCodeString(item.code);
            const name = item.name;

            const existingStock = await config.Stock.findOne({ code });

            if (existingStock && existingStock.code !== code) {
                return;
            }

            const [indexes, sectors] = await Promise.all([
                config.StockIndex.find({ "stocks.code": code }, "category"),
                config.StockSector.find({ "stocks.code": code }, "category"),
            ]);

            const newStock = new config.Stock({
                code,
                name,
                indexes: indexes.map(index => index.category),
                sectors: sectors.map(sector => sector.category),
            });

            await newStock.save();
        }

        res.status(200).send("BORSA ANALIZIM - Hisse Senetleri");
    } catch (error) {
        console.error(error);
        res.status(500).send('Hata oluştu:' + error); // Hata mesajını daha kullanıcı dostu hale getirin
    }
}

async function deleteAllStocks(req, res, next) {
    try {
        await config.Stock.deleteMany({});
        res.status(200).send("Kayıtlar silindi");
    } catch (error) {
        console.error(error);
        res.status(500).send('Hata oluştu:' + error); // Hata mesajını daha kullanıcı dostu hale getirin
    }
}

exports.get = async function (req, res, next) {
    await addAllStocks(req, res, next)
}