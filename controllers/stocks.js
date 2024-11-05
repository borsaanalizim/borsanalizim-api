const axios = require('axios');
const config = require('../config/config')
const stockUtil = require('../utils/stock')
const fileUtil = require('../utils/file')

async function addAllStocks(req, res, next) {
    try {
        const stocks = await fileUtil.readJsonFile('storage/stocks.json')
        const responseKapMembers = await axios.get('https://www.kap.org.tr/tr/api/kapmembers/IGS/A')

        for (const item of stocks) {
            const code = stockUtil.getSingleStockCodeString(item.code)
            if(!code) continue
            const name = item.name
            const sector = item.sector
            var financialGroup = ""

            const existingStock = await config.Stock.findOne({ code })

            if (existingStock) {
                console.log(`${code} zaten mevcut.`)
                continue
            }

            const indexCategories = await config.StockIndex.find({ "stocks.code": code }, "category")
            
            const liquidBank = "BIST LİKİT BANKA"
            const bank = "BIST BANKA"
            const insurance = "BIST SİGORTA"

            const indexes = indexCategories.map(index => index.category)

            if ([liquidBank, bank, insurance].some(item => indexes.includes(item))) {
                financialGroup = "UFRS_K"
            } else {
                financialGroup = "XI_29"
            }

            const responseKapMembersItem = responseKapMembers.data.find((item) => stockUtil.getSingleStockCodeString(item.stockCode) == code)
            const mkkMemberOid = responseKapMembersItem ? responseKapMembersItem.mkkMemberOid || '' : ''

            console.log('Code: ' + code + " mkkMemberOid: " + mkkMemberOid)
    
            const newStock = new config.Stock({
                code,
                name,
                financialGroup,
                mkkMemberOid,
                sector,
                indexes,
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