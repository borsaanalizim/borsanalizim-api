const axios = require('axios')

async function fetchPriceHistory(period, from, to, endeks) {
    try {
        const response = await axios.get('https://www.isyatirim.com.tr/_Layouts/15/IsYatirim.Website/Common/ChartData.aspx/IndexHistoricalAll', { params: { period: period, from: from, to: to, endeks: endeks } })
        // console.log('Endeks: ' + endeks + ' Period: ' + period)
        return response
    } catch (error) {
        console.log('FETCH PRICE HISTORY ERROR: ' + error + ' Period: ' + period + ' Endeks: ' + endeks)
        return fetchPriceHistory(period, from, to, endeks)
    }
}

module.exports = { fetchPriceHistory }