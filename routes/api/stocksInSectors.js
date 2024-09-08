const express = require("express")
const router = express.Router()

const stocksInSectors = require("../../controllers/api/stocksInSectors")
router.get('/', stocksInSectors.get)

module.exports = router