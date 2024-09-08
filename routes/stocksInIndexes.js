const express = require("express")
const router = express.Router()

const stocksInIndexes = require("../controllers/stocksInIndexes")
router.get("/", stocksInIndexes.get)

module.exports = router