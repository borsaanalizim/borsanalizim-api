const indexPage = require('./indexPage')

const sectors = require('./sectors')
const stocksInSectors = require('./stocksInSectors')
const indexes = require('./indexes')
const stocksInIndexes = require('./stocksInIndexes')
const stocks = require('./stocks')

const balanceSheetDatesApi = require("./api/balancesheetdates")
const sectorsApi = require('./api/sectors')
const stocksInSectorsApi = require('./api/stocksInSectors')
const indexesApi = require("./api/indexes")
const stocksInIndexesApi = require("./api/stocksInIndexes")
const stocksApi = require("./api/stocks")

module.exports = function (app) {
    app.use("/", indexPage)

    app.use("/sectors", sectors)
    app.use("/stocksInSectors", stocksInSectors)
    app.use("/indexes", indexes)
    app.use("/stocksInIndexes", stocksInIndexes)
    app.use("/stocks", stocks)

    app.use("/api/balancesheetdates", balanceSheetDatesApi)
    app.use("/api/sectors", sectorsApi)
    app.use("/api/stocksInSectors", stocksInSectorsApi)
    app.use("/api/indexes", indexesApi)
    app.use("/api/stocksInIndexes", stocksInIndexesApi)
    app.use("/api/stocks", stocksApi)
}