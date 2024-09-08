const express = require("express")
const router = express.Router()

const sectors = require("../../controllers/api/sectors")
router.get('/', sectors.get)

module.exports = router