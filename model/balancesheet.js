const mongoose = require('mongoose')

const Schema = mongoose.Schema

const balanceSheetSchema = new Schema({
    stockCode: { type: String, required: true },
    balanceSheets: [
        {
            period: { type: String, required: true },
            currentAssets: { type: String },
            longTermAssets: { type: String },
            inventories: { type: String },
            totalAssets: { type: String },
            paidCapital: { type: String },
            equities: { type: String },
            equitiesOfParentCompany: { type: String },
            financialDebtsLong: { type: String },
            financialDebtsShort: { type: String },
            cashAndCashEquivalents: { type: String },
            financialInvestments: { type: String },
            netOperatingProfitAndLoss: { type: String },
            salesIncome: { type: String },
            grossProfitAndLoss: { type: String },
            previousYearsProfitAndLoss: { type: String },
            netProfitAndLossPeriod: { type: String },
            operatingProfitAndLoss: { type: String },
            periodProfitAndLoss: { type: String },
            depreciationExpenses: { type: String },
            otherExpenses: { type: String },
            periodTaxIncomeAndExpense: { type: String },
            generalAndAdministrativeExpenses: { type: String },
            costOfSales: { type: String },
            marketingSalesAndDistributionExpenses: { type: String },
            researchAndDevelopmentExpenses: { type: String },
            depreciationAndAmortization: { type: String },
            shortTermLiabilities: { type: String },
            longTermLiabilities: { type: String }
        }
    ],

}, { collection: 'balance_sheet' })


module.exports = mongoose.model('BalanceSheet', balanceSheetSchema);