const express = require("express")
const router = express.Router()

const stocks = require("../../controllers/api/stocks")
router.get('/', stocks.get)

module.exports = router