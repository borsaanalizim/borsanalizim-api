const mongoose = require('mongoose')

const Schema = mongoose.Schema

const balanceSheetDateSchema = new Schema({
    stockCode: {
        type: String,
        required: true,
        unique: true
    },
    lastPrice: {
        type: Number,
        required: true
    },
    dates: [
        {
            period: {
                type: String,
                required: true,
                unique: true
            },
            publishedAt: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { _id: false, collection: 'balance_sheet_date' })


module.exports = mongoose.model('BalanceSheetDate', balanceSheetDateSchema);