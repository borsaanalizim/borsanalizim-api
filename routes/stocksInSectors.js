const express = require("express")
const router = express.Router()

const stocksInSectors = require("../controllers/stocksInSectors")
router.get("/", stocksInSectors.get)

module.exports = router