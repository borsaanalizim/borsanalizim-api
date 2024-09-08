const express = require("express")
const router = express.Router()

const balanceSheetDates = require("../../controllers/api/balancesheetdates")
router.get('/', balanceSheetDates.get)

module.exports = router