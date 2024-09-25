const express = require("express")
const router = express.Router()

const createStocks = require("../controllers/createStocks")
router.get("/", createStocks.get)

module.exports = router