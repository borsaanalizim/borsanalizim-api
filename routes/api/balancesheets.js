const express = require("express")
const router = express.Router()

const balanceSheets = require("../../controllers/api/balancesheets")
router.get('/', balanceSheets.get)

module.exports = router