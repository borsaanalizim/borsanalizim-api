const config = require('../config/config')
const stockUtil = require('../utils/stock')
const fileUtil = require('../utils/file')

async function addAllStocks(req, res, next) {
    try {
        const stocks = await fileUtil.readJsonFile('storage/stocks.json')

        for (const item of stocks) {
            const code = stockUtil.getSingleStockCodeString(item.code)
            if(!code) continue
            const name = item.name
            var financialGroup = ""

            const existingStock = await config.Stock.findOne({ code })

            if (existingStock) {
                console.log(`${code} zaten mevcut.`)
                continue
            }

            const [indexes, sectors] = await Promise.all([
                config.StockIndex.find({ "stocks.code": code }, "category"),
                config.StockSector.find({ "stocks.code": code }, "category"),
            ]);
            
            const liquidBank = "BIST LİKİT BANKA"
            const bank = "BIST BANKA"
            const insurance = "BIST SİGORTA"

            const indexCategories = indexes.map(index => index.category)

            if ([liquidBank, bank, insurance].some(item => indexCategories.includes(item))) {
                financialGroup = "UFRS_K"
            } else {
                financialGroup = "XI_29"
            }

            const newStock = new config.Stock({
                code,
                name,
                financialGroup,
                indexes: indexCategories,
                sectors: sectors.map(sector => sector.category),
            })

            await newStock.save()
            console.log(`${code} eklendi.`)
        }

        res.status(200).send("BORSA ANALIZIM - Hisse Senetleri güncellendi.")
    } catch (error) {
        console.error(error)
        res.status(500).send('Hata oluştu:' + error)
    }
}

async function deleteAllStocks(req, res, next) {
    try {
        await config.Stock.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        console.error(error)
        res.status(500).send('Hata oluştu:' + error)
    }
}

exports.get = async function (req, res, next) {
    await addAllStocks(req, res, next)
}