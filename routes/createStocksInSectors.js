const express = require("express")
const router = express.Router()

const createStocksInSectors = require("../controllers/createStocksInSectors")
router.get("/", createStocksInSectors.get)

module.exports = router