const axios = require('axios');
const config = require('../config/config');
const dateUtil = require('./date');
const stockUtil = require('./stock');

const { fetchPriceHistory } = require('./pricehistory');

const requestData = {
    "fromDate": dateUtil.nowYear() + "-01-01",
    "toDate": dateUtil.nowYear() + "-12-31",
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
    "mkkMemberOidList": [],
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

async function memberDisclosureQuery() {
    try {
        const response = await axios.post('https://www.kap.org.tr/tr/api/memberDisclosureQuery', requestData);
        const responseData = response.data;

        for (const item of responseData) {
            await processDisclosureItem(item);
        }
    } catch (error) {
        console.error("Disclosure Query Error:", error);
    }
}

async function processDisclosureItem(item) {
    const { year, ruleTypeTerm, publishDate, stockCodes } = item;
    const formattedTime = dateUtil.formatDateOfSpecial(publishDate);
    const publishedAt = formattedTime || publishDate;
    const stockCode = stockUtil.getSingleStockCodeString(stockCodes);
    const lastUpdated = Date.now();

    const period = determinePeriod(year, ruleTypeTerm);
    const { price, lastPrice } = await getPrices(stockCode, publishedAt);

    const balanceSheetDate = await config.BalanceSheetDate.findOne({ stockCode });

    if (balanceSheetDate) {
        updateExistingBalanceSheet(balanceSheetDate, period, publishedAt, price, lastPrice, lastUpdated);
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

async function getPrices(stockCode, publishedAt) {
    let price, lastPrice;
    try {
        const priceHistoryResponse = await fetchPriceHistory('1440', dateUtil.nowYear() + '0101000000', dateUtil.nowYear() + '1231235959', stockCode + '.E.BIST');

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