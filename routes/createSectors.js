const express = require("express")
const router = express.Router()

const createSectors = require("../controllers/createSectors")
router.get("/", createSectors.get)

module.exports = router