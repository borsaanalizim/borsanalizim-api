const express = require("express");
const cron = require('node-cron');

const db = require("./config/db");
const notificationUtil = require('./utils/notification');
const balanceSheetUtil = require('./utils/balancesheet');
const dateUtil = require('./utils/date');

const app = express();

app.use(express.json());

// Yönlendirme ayarları
require('./routes/manager')(app);

// Cron job ile her gece çalışacak görev
const schedule = cron.schedule('0 0 * * *', async () => {
    await notificationUtil.memberDisclosureQuery();
    await balanceSheetUtil.getBalanceSheets(`${dateUtil.nowYear() - 1}`);
    await balanceSheetUtil.getBalanceSheets(`${dateUtil.nowYear()}`);
});

// Sunucu dinleme ve veritabanı bağlantısı
app.listen(3001, async () => {
    try {
        await db.connectDB(); // Veritabanı bağlantısı kurulduktan sonra sunucu başlar
        console.log("Sunucu 3001 portunda dinleniyor");
        schedule.start(); // Veritabanı bağlantısı başarılıysa cron işini başlat
    } catch (err) {
        console.error("Veritabanına bağlanırken bir hata oluştu:", err);
        process.exit(1); // Bağlantı başarısızsa sunucu başlatılmaz
    }
});

// Sunucu kapanış sinyallerini yakalama ve veritabanı bağlantısını kapatma
process.on('SIGINT', async () => {
    console.log("SIGINT sinyali alındı. Sunucu kapatılıyor...");
    await db.closeDB(); // Veritabanı bağlantısını düzgün kapat
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log("SIGTERM sinyali alındı. Sunucu kapatılıyor...");
    await db.closeDB(); // Veritabanı bağlantısını düzgün kapat
    process.exit(0);
});