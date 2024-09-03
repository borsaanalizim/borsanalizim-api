const { Double, Decimal128 } = require('bson');
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const balanceSheetDateSchema = new Schema({
    period: {
        type: String,
        required: true
    },
    publishedAt: {
        type: String,
        required: true
    },
    stockCode: {
        type: String,
        required: true
    },
    price: {
        type: Decimal128,
        required: true
    }
}, {collection: 'balance_sheet_date'})


module.exports = mongoose.model('BalanceSheetDate', balanceSheetDateSchema);