const express = require("express")
const router = express.Router()

const balanceSheetDates = require("../controllers/balancesheetdates")
router.get('/', balanceSheetDates.get)

/*
const Joi = require("joi")
router.post("/", (req, res) => {
    console.log(req.body)
    const schema = Joi.object({
        stockCode: Joi.string().min(4).max(5).required(),
        period: Joi.string().required(),
        publishedAt: Joi.string().required()
    })
    const result = schema.validate(req.body)
    if(result.error) {
        res.status(400).send(result.error.details)
        return
    }

    const balanceSheetDate = {
        id: balanceSheetDatesData.length + 1,
        stockCode: req.body.stockCode,
        period: req.body.period,
        publishedAt: req.body.publishedAt
    }
    balanceSheetDatesData.push(balanceSheetDate)
    res.send(balanceSheetDate)
})
*/
module.exports = router