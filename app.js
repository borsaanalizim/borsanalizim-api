const express = require("express")
const axios = require('axios')

const app = express()

const main = require("./routes/main")
const balanceSheetDates = require("./routes/balancesheetdates")
const db = require("./config/db")
const config = require("./config/config")
const dateUtil = require("./utils/date")

app.use(express.json())

app.use("/", main)
app.use("/api/balancesheetdates", balanceSheetDates)

const requestData = {
    "fromDate": dateUtil.nowYear() + "-01-01",
    "toDate": dateUtil.nowYear() + "-12-31",
    "year": "",
    "prd": "",
    "term": "",
    "ruleType": "",
    "bdkReview": "",
    "disclosureClass": "FR",
    "index": "33E5FED8017C00EAE0530A4A622B2AEA",
    "market": "",
    "isLate": "",
    "subjectList": ["4028328c594bfdca01594c0af9aa0057"], // 4028328c594bfdca01594c0af9aa0057, 4028328d594c04f201594c5155dd0076
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
}

async function memberDisclosureQuery() {
    const response = await axios.post('https://www.kap.org.tr/tr/api/memberDisclosureQuery', requestData)
    const responseData = response.data

    responseData.forEach(async (item, index) => {

        const year = item.year;
        const ruleTypeTerm = item.ruleTypeTerm;
        const formattedTime = dateUtil.formatDateOfSpecial(item.publishDate)
        const publishedAt = formattedTime ? formattedTime : item.publishDate
        const stockCode = item.stockCodes

        let period
        if (ruleTypeTerm && typeof ruleTypeTerm === 'string') {
            period = year + "/" + (ruleTypeTerm === "Yıllık" ? "12" : ruleTypeTerm.slice(0, 1))
        } else {
            period = ""
        }

        let price
        const priceHistoryResponse = await fetchPriceHistory('1440', dateUtil.nowYear() + '0101000000', dateUtil.nowYear() + '1231235959', stockCode + '.E.BIST')
            const priceHistoryResponseData = priceHistoryResponse.data.data
            if (priceHistoryResponse) {
                let priceHistoryMap = {}
                priceHistoryResponseData.forEach((priceHistoryItem, priceHistoryIndex) => {
                    const date = dateUtil.formatDateFromTimestamp(priceHistoryItem[0])
                    priceHistoryMap[date] = priceHistoryItem[1]
                })
                if (typeof publishedAt === 'string') {
                    const shortPublishedAt = publishedAt.split("T")[0]
                    let foundPrice = false;
                    for (const date in priceHistoryMap) {
                        if (date >= shortPublishedAt) {
                            price = priceHistoryMap[date];
                            foundPrice = true;
                            break;
                        }
                    }
                }
            }

        const balanceSheetDate = await config.BalanceSheetDate.findOne({ period: period, stockCode: stockCode })

        if (balanceSheetDate) {
            balanceSheetDate.set({ publishedAt, stockCode, price });
            await balanceSheetDate.save();
            console.log("Data updated successfully!")
            return
        }

        const newBalanceSheetDate = new config.BalanceSheetDate({
            period,
            publishedAt,
            stockCode,
            price
        })
        console.log(newBalanceSheetDate)

        // Save the document
        // await newBalanceSheetDate.save()

        // console.log("Data saved successfully!")
    })
}

async function dropDatabase() {
    try {
        await db.mongoose.connection.dropDatabase();
        console.log('Database dropped successfully');
        process.exit(0); // Uygulamayı kapat
    } catch (error) {
        console.error('Error dropping database:', error);
    }
}

async function getAllData() {
    try {
        const balanceSheetDates = await config.BalanceSheetDate.find()
        console.log(balanceSheetDates);
    } catch (error) {
        console.error('Error: ', error);
    }
}


async function fetchPriceHistory(period, from, to, endeks) {
    try {
        const response = await axios.get('https://www.isyatirim.com.tr/_Layouts/15/IsYatirim.Website/Common/ChartData.aspx/IndexHistoricalAll', { params: { period: period, from: from, to: to, endeks: endeks } })
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

app.listen(3001, async () => {
    // await getAllData()
    // await dropDatabase()
    // await memberDisclosureQuery()
    console.log("listening on port 3001")
})