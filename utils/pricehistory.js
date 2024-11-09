const axios = require('axios')
const rateLimit = require('axios-rate-limit')

const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000 })

async function fetchPriceHistory(period, from, to, endeks) {
    try {
        const response = await http.get('https://www.isyatirim.com.tr/_Layouts/15/IsYatirim.Website/Common/ChartData.aspx/IndexHistoricalAll', { params: { period: period, from: from, to: to, endeks: endeks } })
        console.log('Endeks: ' + endeks + ' Period: ' + period)
        return response
    } catch (error) {
        console.log('FETCH PRICE HISTORY ERROR: ' + error + ' Period: ' + period + ' Endeks: ' + endeks)
        return fetchPriceHistory(period, from, to, endeks)
    }
}

module.exports = { fetchPriceHistory }