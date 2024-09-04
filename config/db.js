const mongoose = require("mongoose")

const connectionString = 'mongodb://127.0.0.1:27017/borsaanalizim_db'

async function connectDB() {
    try {
        await mongoose.connect(connectionString);
        console.log('Mongoose bağlantısı kuruldu');
    } catch (err) {
        console.log("DB ERROR:" + err);
        throw err; // Eğer bağlantı kurulamazsa, hatayı fırlat ki uygulama başlamasın
    }
}

module.exports = {
    mongoose,
    connectDB,
}