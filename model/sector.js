const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sectorSchema = new Schema({
    mainCategory: {
        type: String,
        required: true
    },
    subCategories: [
        {
            type: String,
            required: true
        }
    ]
}, { collection: 'sector' })

module.exports = mongoose.model('Sector', sectorSchema);