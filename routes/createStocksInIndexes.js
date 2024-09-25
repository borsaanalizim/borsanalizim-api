const express = require("express")
const router = express.Router()

const createStocksInIndexes = require("../controllers/createStocksInIndexes")
router.get("/", createStocksInIndexes.get)

module.exports = router