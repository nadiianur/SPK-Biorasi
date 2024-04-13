const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/karyawan/kepala biro/terburuk')
const middleware = require('../../../middleware/authentication')

router.get('/allTerburukBiro', middleware.verifyTokenKepala, controllers.allPegawaiTerburuk)

module.exports = router