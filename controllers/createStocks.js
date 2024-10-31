require('dotenv').config();
const { spawn } = require('child_process')

const pythonPath = process.env.PYTHON_PATH;

async function createStocks(req, res, next) {
    try {
        console.log(pythonPath)
        await new Promise((resolve, reject) => {
            const url = 'https://www.kap.org.tr/tr/bist-sirketler';
            const python = spawn(pythonPath, ['storage/stocks.py', url]);
    
            let output = '';
            let errorOutput = '';
    
            // Python betiğinden gelen başarılı çıktıyı toplar
            python.stdout.on('data', (data) => {
                console.log("Python Output:", data.toString()); // Çıktıyı logla
                output += data.toString();
            });
    
            // Python betiğinden gelen hata çıktısını toplar
            python.stderr.on('data', (data) => {
                console.error("Python Error Output:", data.toString()); // Hataları logla
                errorOutput += data.toString();
            });
    
            // Python betiği tamamlandığında işlemi bitirir
            python.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python betiği hata ile kapandı: ${code}`);
                    reject(new Error(`Python betiği hata ile kapandı: ${errorOutput}`));
                } else {
                    console.log("Python betiği başarıyla çalıştırıldı.");
                    res.status(200).send("Hisseler oluşturuldu.");
                    resolve(output);
                }
            });
        });
    } catch (error) {
        res.status(500).send(`Hata oluştu: ${error}`);
    }
}

exports.get = async function (req, res, next) {
    try {
        await createStocks(req, res, next);
    } catch (error) {
        console.error("Hata oluştu: ", error);
        res.status(500).send("Bir hata oluştu: " + error.message);
    }
};