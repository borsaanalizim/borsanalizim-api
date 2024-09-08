const mongoose = require('mongoose')

const Schema = mongoose.Schema

const stockSectorSchema = new Schema({
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
}, { collection: 'stock_sector' })

module.exports = mongoose.model('StockSector', stockSectorSchema);