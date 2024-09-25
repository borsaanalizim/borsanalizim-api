const express = require("express")
const router = express.Router()

const createIndexes = require("../controllers/createIndexes")
router.get("/", createIndexes.get)

module.exports = router