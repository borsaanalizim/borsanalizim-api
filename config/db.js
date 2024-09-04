const mongoose = require("mongoose")

const connectionString = 'mongodb://127.0.0.1:27017/borsaanalizim_db'

mongoose.connect(connectionString)
    .then(() => {
        console.log('mongoose baglandi')
    })
    .catch(err => {
        console.log("DB ERROR:" + err)
    })

module.exports = mongoose