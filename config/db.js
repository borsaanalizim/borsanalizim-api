const mongoose = require("mongoose");

const connectionString = 'mongodb://127.0.0.1:27017/borsaanalizim_db';

// Veritabanına bağlanma fonksiyonu
async function connectDB() {
    try {
        await mongoose.connect(connectionString);
        console.log('Mongoose bağlantısı kuruldu');
    } catch (err) {
        console.log("DB ERROR:" + err);
        throw err; // Eğer bağlantı kurulamazsa, hatayı fırlat ki uygulama başlamasın
    }
}

// Veritabanı bağlantısını kapatma fonksiyonu
async function closeDB() {
    try {
        await mongoose.connection.close(); // Bağlantı kapanana kadar beklenir
        console.log('Mongoose bağlantısı kapatıldı');
    } catch (err) {
        console.log("DB Kapatma Hatası:" + err);
        throw err;
    }
}

module.exports = {
    connectDB,
    closeDB,
};