const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/admin/terbaik')
const middleware = require('../../middleware/authentication')

router.post('/pegawaiTerbaik', middleware.verifyTokenAdmin, controllers.pegawaiTerbaik)
router.get('/allPegawaiTerbaik', middleware.verifyTokenAdmin, controllers.allPegawaiTerbaik)

module.exports = router