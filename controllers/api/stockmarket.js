const config = require("../../config/config");

exports.get = async function (req, res, next) {
    try {
        const stocks = await config.Stock.find().select('-_id -__v').lean();
        const indexes = await config.Index.find().select('-_id -__v').lean();
        const sectors = await config.Sector.findOne().select('-_id -__v').lean();

        const stockMarket = {
            stocks,
            indexes,
            sectors
        };

        res.status(200).json({ data: stockMarket });
    } catch (error) {
        res.status(500).json({ error: { message: "Bilinmeyen bir hata oluştu", detail: error } });
    }
};