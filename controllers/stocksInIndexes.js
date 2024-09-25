const config = require('../config/config')
const fileUtil = require('../utils/file')

async function deleteAllStocksInIndexes(req, res, next) {
    try {
        await config.StockIndex.deleteMany({})
        res.status(200).send("Kayıtlar silindi")
    } catch (error) {
        res.status(500).send('Hata oluştu:' + error)
    }
}

async function addAllStocksInIndexes(req, res, next) {
    try {
        const indexes = await fileUtil.readJsonFile('storage/stocksInIndexes.json')
        const stockIndexes = await config.StockIndex.find()
        const indexMap = new Map()
        stockIndexes.forEach(index => indexMap.set(index.category, index))

        for (const item of indexes) {
            const { category, stocks } = item
            let index = indexMap.get(category)
            if (!index) {
                index = new config.StockIndex({ category, stocks })
            } else {
                // Mevcut index'i güncelle
                const existingStocks = new Set(index.stocks.map(s => s.code))
                const stocksFiltered = stocks.filter(stock => !existingStocks.has(stock.code))
                for(const stockFiltered of stocksFiltered) {
                    index.stocks.push(stockFiltered)
                }
            }

            await index.save()
        }

        res.status(200).send("BORSA ANALIZIM - Endekslerdeki Hisse Senetleri")
    } catch (error) {
        res.status(500).send("Bilinmeyen bir hata oluştu: " + error)
    }
}

exports.get = async function (req, res, next) {
    await addAllStocksInIndexes(req, res, next)
}