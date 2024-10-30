const express = require("express")
const router = express.Router()

const balanceSheetDates = require("../controllers/balancesheetdates")
router.get("/", balanceSheetDates.get)

module.exports = router