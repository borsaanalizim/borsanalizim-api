const axios = require('axios')
const axiosRetry = require('axios-retry').default
const rateLimit = require('axios-rate-limit')
const config = require('../config/config')
const dateUtil = require('./date')
const logUtil = require('./log')
const stockUtil = require('./stock')
const { fetchPriceHistory } = require('./pricehistory')

const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000 })

axiosRetry(axios, {
    retries: 3, // Tekrar sayısı
    retryDelay: (retryCount) => {
        console.log(`Retry attempt: ${retryCount}`)
        return retryCount * 30000 // Her denemede 1 saniye gecikme
    },
    retryCondition: (error) => {
        return error.code === 'ETIMEDOUT' || error.code === 'HPE_INVALID_CONSTANT' // Sadece ETIMEDOUT hatalarında tekrar dene
    },
})

async function memberDisclosureQuery(mkkMemberOid, year) {
    const yearValue = year || dateUtil.nowYear()

    const requestData = {
        "fromDate": `${yearValue}-01-01`,
        "toDate": `${yearValue}-12-31`,
        "year": "",
        "prd": "",
        "term": "",
        "ruleType": "",
        "bdkReview": "",
        "disclosureClass": "FR",
        "index": "",
        "market": "",
        "isLate": "",
        "subjectList": ["4028328c594bfdca01594c0af9aa0057"],
        "mkkMemberOidList": [mkkMemberOid],
        "inactiveMkkMemberOidList": [],
        "bdkMemberOidList": [],
        "mainSector": "",
        "sector": "",
        "subSector": "",
        "memberType": "IGS",
        "fromSrc": "N",
        "srcCategory": "",
        "discIndex": []
    }

    try {
        const response = await http.post('https://www.kap.org.tr/tr/api/memberDisclosureQuery', requestData, {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
            }
        })
        const responseData = response.data

        await Promise.all(
            responseData.map(item => processDisclosureItem(item, yearValue))
        )
    } catch (error) {
        logUtil.logMessage('balancesheetdate_notification.txt', `Disclosure Query Error: ${error}`, true)
    }
}

async function processDisclosureItem(item, yearValue) {
    const { year, ruleTypeTerm, publishDate, stockCodes } = item
    const publishedAt = dateUtil.formatDateOfSpecial(publishDate) || publishDate
    const stockCode = stockUtil.getSingleStockCodeString(stockCodes)
    const period = determinePeriod(year, ruleTypeTerm)
    const { price, lastPrice } = await getPrices(stockCode, publishedAt, yearValue)

    if (!lastPrice) {
        logUtil.logMessage('balancesheetdate_notification.txt', `Stock: ${stockCode} Period: ${period} Price: ${price} Last Price: ${lastPrice}`, null)
        return
    }

    const balanceSheetDate = await config.BalanceSheetDate.findOne({ stockCode })
    if (balanceSheetDate) {
        await updateExistingBalanceSheetDate(balanceSheetDate, period, publishedAt, price, lastPrice)
    } else {
        await createNewBalanceSheetDate(stockCode, period, publishedAt, price, lastPrice)
    }
}

function determinePeriod(year, ruleTypeTerm) {
    return ruleTypeTerm && typeof ruleTypeTerm === 'string'
        ? `${year}/${ruleTypeTerm === "Yıllık" ? "12" : ruleTypeTerm.slice(0, 1)}`
        : ""
}

async function getPrices(stockCode, publishedAt, yearValue) {
    let price, lastPrice
    try {
        const priceHistoryResponse = await fetchPriceHistory('1440', `${yearValue}0101000000`, `${yearValue}1231235959`, `${stockCode}.E.BIST`)
        if (priceHistoryResponse) {
            const priceHistoryMap = priceHistoryResponse.data.data.reduce((map, item) => {
                const date = dateUtil.formatDateFromTimestamp(item[0])
                map[date] = item[1]
                return map
            }, {})
            lastPrice = Object.values(priceHistoryMap).slice(-1)[0]
            if (typeof publishedAt === 'string') {
                const shortPublishedAt = publishedAt.split("T")[0]
                price = Object.entries(priceHistoryMap).find(([date]) => date >= shortPublishedAt)?.[1]
                if (!price) {
                    let dateString;
                    dateString += shortPublishedAt;
                    Object.keys(priceHistoryMap).forEach((date) => {
                        dateString += `${date} - `
                    });
                    logUtil.logMessage('balancesheetdate_notification.txt', `Price is null: ${error}`, true)
                }
            }
        }
    } catch (error) {
        logUtil.logMessage('balancesheetdate_notification.txt', `Fetch Price Error: ${error}`, true)
    }
    return { price, lastPrice }
}

async function updateExistingBalanceSheetDate(balanceSheetDate, period, publishedAt, price, lastPrice) {
    try {
        const existingPeriod = balanceSheetDate.dates.find(dateObj => dateObj.period === period)
        balanceSheetDate.lastPrice = lastPrice
        if (!existingPeriod && price) {
            balanceSheetDate.dates.push({ period, publishedAt, price })
            balanceSheetDate.lastUpdated = new Date()
            logUtil.logMessage('balancesheetdate_notification.txt', `${balanceSheetDate.stockCode}-${period}-${price} güncellendi`, null)
        }
        await balanceSheetDate.save()
    } catch (error) {
        logUtil.logMessage('balancesheetdate_notification.txt', `BalanceSheetDate Update Error: ${error}`, true)
    }
}

async function createNewBalanceSheetDate(stockCode, period, publishedAt, price, lastPrice) {
    try {
        const newBalanceSheetDate = new config.BalanceSheetDate({
            stockCode,
            lastPrice,
            dates: [{ period, publishedAt, price }],
            lastUpdated: new Date()
        })
        logUtil.logMessage('balancesheetdate_notification.txt', `${stockCode}-${period} eklendi`, null)
        await newBalanceSheetDate.save()
    } catch (error) {
        logUtil.logMessage('balancesheetdate_notification.txt', `BalanceSheetDate Create Error: ${error}`, true)
    }
}

module.exports = { memberDisclosureQuery }