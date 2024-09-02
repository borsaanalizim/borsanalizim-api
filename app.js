const express = require("express")
const request = require("request")

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
    request.post({
        headers: { 'Accept': 'application/json, text/plain, */*', 'content-type': 'application/json;charset=utf-8' },
        url: 'https://www.kap.org.tr/tr/api/memberDisclosureQuery',
        body: JSON.stringify(requestData)
    }, async function (error, response, body) {
        const responseData = JSON.parse(body)

        responseData.forEach(async (item, index) => {

            const year = item.year;
            const ruleTypeTerm = item.ruleTypeTerm;
            const formattedTime = dateUtil.formatDate(item.publishDate)
            const publishedAt = formattedTime ? formattedTime : item.publishDate
            const stockCode = item.stockCodes

            let period
            if (ruleTypeTerm && typeof ruleTypeTerm === 'string') {
                period = year + "/" + (ruleTypeTerm === "Yıllık" ? "12" : ruleTypeTerm.slice(0, 1))
            } else {
                period = ""
            }

            const balanceSheetDate = await config.BalanceSheetDate.findOne({ period: period, stockCode: stockCode })

            if (balanceSheetDate) {
                balanceSheetDate.set({ publishedAt, stockCode });
                await balanceSheetDate.save();
                console.log("Data updated successfully!")
                return
            }

            const newBalanceSheetDate = new config.BalanceSheetDate({
                period,
                publishedAt,
                stockCode
            })
            console.log(newBalanceSheetDate)

            // Save the document
            await newBalanceSheetDate.save()

            // console.log("Data saved successfully!")
        })
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

app.listen(3001, async () => {
    // await getAllData()
    // await dropDatabase()
    // await memberDisclosureQuery()
    console.log("listening on port 3001")
})