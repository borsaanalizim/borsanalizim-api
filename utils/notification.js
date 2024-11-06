const axios = require('axios');
const config = require('../config/config');
const dateUtil = require('./date');
const stockUtil = require('./stock');

const { fetchPriceHistory } = require('./pricehistory');

async function memberDisclosureQuery(mkkMemberOid, year) {

    var yearValue = dateUtil.nowYear()

    if (year) {
        yearValue = year
    }

    const requestData = {
        "fromDate": yearValue + "-01-01",
        "toDate": yearValue + "-12-31",
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
    };
    try {
        const response = await axios.post('https://www.kap.org.tr/tr/api/memberDisclosureQuery', requestData);
        const responseData = response.data;

        for (const item of responseData) {
            await processDisclosureItem(item, yearValue);
        }
    } catch (error) {
        console.error("Disclosure Query Error:", error);
    }
}

async function processDisclosureItem(item, yearValue) {
    const { year, ruleTypeTerm, publishDate, stockCodes } = item;
    const formattedTime = dateUtil.formatDateOfSpecial(publishDate);
    const publishedAt = formattedTime || publishDate;
    const stockCode = stockUtil.getSingleStockCodeString(stockCodes);
    const lastUpdated = Date.now();

    const period = determinePeriod(year, ruleTypeTerm);
    const { price, lastPrice } = await getPrices(stockCode, publishedAt, yearValue);

    if(!lastPrice) {
        console.log('Stock: ' + stockCode + ' Period: ' + period + ' Price: ' + price + ' Last Price: ' + lastPrice)
        return
    }

    const balanceSheetDate = await config.BalanceSheetDate.findOne({ stockCode });

    if (balanceSheetDate) {
        await updateExistingBalanceSheet(balanceSheetDate, period, publishedAt, price, lastPrice, lastUpdated);
    } else {
        await createNewBalanceSheet(stockCode, period, publishedAt, price, lastPrice, lastUpdated);
    }
}

function determinePeriod(year, ruleTypeTerm) {
    if (ruleTypeTerm && typeof ruleTypeTerm === 'string') {
        return year + "/" + (ruleTypeTerm === "Yıllık" ? "12" : ruleTypeTerm.slice(0, 1));
    }
    return "";
}

async function getPrices(stockCode, publishedAt, yearValue) {
    let price, lastPrice;
    try {
        const priceHistoryResponse = await fetchPriceHistory('1440', yearValue + '0101000000', yearValue + '1231235959', stockCode + '.E.BIST');

        if (priceHistoryResponse) {
            const priceHistoryMap = priceHistoryResponse.data.data.reduce((map, item) => {
                const date = dateUtil.formatDateFromTimestamp(item[0]);
                map[date] = item[1];
                return map;
            }, {});

            lastPrice = Object.values(priceHistoryMap).slice(-1)[0];

            if (typeof publishedAt === 'string') {
                const shortPublishedAt = publishedAt.split("T")[0];
                price = Object.entries(priceHistoryMap).find(([date]) => date >= shortPublishedAt)?.[1];
            }
        }
    } catch (error) {
        console.error("Price Fetch Error:", error);
    }

    return { price, lastPrice };
}

async function updateExistingBalanceSheet(balanceSheetDate, period, publishedAt, price, lastPrice, lastUpdated) {
    const existingPeriod = balanceSheetDate.dates.find(dateObj => dateObj.period === period);

    balanceSheetDate.lastPrice = lastPrice;
    if (!existingPeriod) {
        balanceSheetDate.dates.push({ period, publishedAt, price });
        balanceSheetDate.lastUpdated = lastUpdated;
    }
    await balanceSheetDate.save();
}

async function createNewBalanceSheet(stockCode, period, publishedAt, price, lastPrice, lastUpdated) {
    const newBalanceSheetDate = new config.BalanceSheetDate({
        stockCode,
        lastPrice,
        dates: [{ period, publishedAt, price }],
        lastUpdated
    });
    await newBalanceSheetDate.save();
}

module.exports = { memberDisclosureQuery };