const express = require("express")
const router = express.Router()

const stocksInIndexes = require("../../controllers/api/stocksInIndexes")
router.get('/', stocksInIndexes.get)

module.exports = router