const express = require("express")
const router = express.Router()

const indexPage = require("../controllers/indexPage")
router.get("/", indexPage.get)

module.exports = router