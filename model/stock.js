const mongoose = require('mongoose')

const Schema = mongoose.Schema

const stockSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    financialGroup: {
        type: String,
        required: true
    },
    indexes: {
        type: [String],
        required: true,
    },
    sectors: {
        type: [String],
        required: true
    }
}, { collection: 'stock' })

module.exports = mongoose.model('Stock', stockSchema);