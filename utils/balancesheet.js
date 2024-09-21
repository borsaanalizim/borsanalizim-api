const axios = require('axios');
const config = require('../config/config');

async function getBalanceSheets(year) {
    try {
        const stocks = await config.Stock.find();

        for (const stockItem of stocks) {
            const companyCode = stockItem.code;
            const exchange = "TRY";
            const financialGroup = stockItem.financialGroup;
            const periods = [
                { year: year, period: "3" },
                { year: year, period: "6" },
                { year: year, period: "9" },
                { year: year, period: "12" }
            ];

            if(financialGroup == "UFRS_K") {
                continue
            }

            const response = await fetchBalanceSheet(companyCode, exchange, financialGroup, periods)

            const responseDataValues = response.data.value;

            const balanceSheetData = periods.map((p, idx) => {
                return responseDataValues.reduce((acc, responseItem) => {
                    acc[responseItem.itemCode] = responseItem[`value${idx + 1}`];
                    return acc;
                }, {});
            });

            for (let i = 0; i < balanceSheetData.length; i++) {
                const periodData = balanceSheetData[i];
                if (periodData) {
                    await saveOrUpdateBalanceSheet(
                        companyCode, 
                        `${periods[i].year}/${periods[i].period}`, 
                        periodData
                    );
                }
            }
        }
    } catch (error) {
        console.error("Balance Sheet Error:", error);
    }
}

async function fetchBalanceSheet(companyCode, exchange, financialGroup, periods) {
    try {
        const response = await axios.get(
            'https://www.isyatirim.com.tr/_layouts/15/IsYatirim.Website/Common/Data.aspx/MaliTablo',
            {
                params: {
                    companyCode,
                    exchange,
                    financialGroup,
                    year1: periods[0].year,
                    period1: periods[0].period,
                    year2: periods[1].year,
                    period2: periods[1].period,
                    year3: periods[2].year,
                    period3: periods[2].period,
                    year4: periods[3].year,
                    period4: periods[3].period,
                }
            }
        );
        return response
    } catch (error) {
        console.log("ERROR SERVICE: " + error + " Company: " + companyCode + " Periods: " + periods)
        return fetchBalanceSheet(companyCode, exchange, financialGroup, periods)
    }
}

async function saveOrUpdateBalanceSheet(stockCode, period, data) {
    try {
        if(!data['1A']) {
            console.log(`${stockCode} - ${period} ait bilanço verisi bulunamadı`)
            return
        }
        // Aynı stockCode ve period'a sahip bir kayıt var mı kontrol ediyoruz
        const existingBalanceSheet = await config.BalanceSheet.findOne({
            stockCode,
            'balanceSheets.period': period
        })

        if (existingBalanceSheet) {
            console.log(`Kayıt zaten mevcut: ${stockCode} - ${period}`)
            return // Aynı stockCode ve period varsa, yeni kayıt yapmıyoruz.
        }

        // Eğer yoksa güncelleme veya yeni kayıt işlemi
        const balanceSheetUpdate = {
            period,
            currentAssets: data['1A'],
            longTermAssets: data['1AK'],
            paidCapital: data['2OA'],
            equities: data['2N'],
            equitiesOfParentCompany: data['2O'],
            financialDebtsLong: data['2BA'],
            financialDebtsShort: data['2AA'],
            cashAndCashEquivalents: data['1AA'],
            financialInvestments: data['1BC'],
            netOperatingProfitAndLoss: data['3H'],
            salesIncome: data['3C'],
            grossProfitAndLoss: data['3D'],
            previousYearsProfitAndLoss: data['2OCE'],
            netProfitAndLossPeriod: data['2OCF'],
            operatingProfitAndLoss: data['3DF'],
            depreciationExpenses: data['4B'],
            otherExpenses: data['3CAD'],
            periodTaxIncomeAndExpense: data['3IB'],
            generalAndAdministrativeExpenses: data['3DA'],
            costOfSales: data['3CA'],
            marketingSalesAndDistributionExpenses: data['3DA'],
            researchAndDevelopmentExpenses: data['3DC'],
            depreciationAndAmortization: data['4CAB'],
            shortTermLiabilities: data['2A'],
            longTermLiabilities: data['2B']
        }

        // StockCode'a göre mevcut kayıt var mı kontrol ediliyor
        const existingStock = await config.BalanceSheet.findOne({ stockCode })

        if (existingStock) {
            // Mevcut stockCode için yeni bir period ekliyoruz
            existingStock.balanceSheets.push(balanceSheetUpdate)
            await existingStock.save()
            console.log(`Güncellendi: ${stockCode} - ${period}`)
        } else {
            // Yeni stockCode ve balanceSheet ekliyoruz
            const newBalanceSheet = new config.BalanceSheet({
                stockCode,
                balanceSheets: [balanceSheetUpdate]
            })
            await newBalanceSheet.save()
            console.log(`Yeni kayıt yapıldı: ${stockCode} - ${period}`)
        }

    } catch (error) {
        console.error(`Error saving or updating balance sheet for ${stockCode} - ${period}:`, error)
    }
}

module.exports = { getBalanceSheets }