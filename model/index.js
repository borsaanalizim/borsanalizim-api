const mongoose = require('mongoose')

const Schema = mongoose.Schema

const indexSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {collection: 'index'})


module.exports = mongoose.model('Index', indexSchema);