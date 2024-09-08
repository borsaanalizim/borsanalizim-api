const mongoose = require('mongoose')

const Schema = mongoose.Schema

const stockIndexSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    stocks: [
        {
            code: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ]
}, { collection: 'stock_index' })

module.exports = mongoose.model('StockIndex', stockIndexSchema);