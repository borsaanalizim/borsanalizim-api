const mongoose = require("mongoose")

const connectionString = 'mongodb://167.99.6.203:27017/borsaanalizim_db'

mongoose.connect(connectionString)
    .then(() => {
        console.log('mongoose baglandi')
    })
    .catch(err => {
        console.log("DB ERROR:" + err)
    })

module.exports = mongoose