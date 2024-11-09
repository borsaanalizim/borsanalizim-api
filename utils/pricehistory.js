const axios = require('axios')
const rateLimit = require('axios-rate-limit')
const logUtil = require('./log')

const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000 })

async function fetchPriceHistory(period, from, to, endeks) {
    try {
        const response = await http.get('https://www.isyatirim.com.tr/_Layouts/15/IsYatirim.Website/Common/ChartData.aspx/IndexHistoricalAll', { params: { period: period, from: from, to: to, endeks: endeks } })
        logUtil.logMessage('balancesheetdate_notification.txt', `Endeks: ${endeks}`, null)
        return response
    } catch (error) {
        logUtil.logMessage('balancesheetdate_notification.txt', `FETCH PRICE HISTORY ERROR: ${error} Endeks: ${endeks}`, true)
        return fetchPriceHistory(period, from, to, endeks)
    }
}

module.exports = { fetchPriceHistory }