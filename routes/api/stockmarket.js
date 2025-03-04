const express = require("express")
const router = express.Router()

const stockmarket = require("../../controllers/api/stockmarket")
router.get('/', stockmarket.get)

module.exports = router