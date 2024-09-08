const express = require("express")
const router = express.Router()

const indexes = require('../controllers/indexes')
router.get("/", indexes.get)

module.exports = router