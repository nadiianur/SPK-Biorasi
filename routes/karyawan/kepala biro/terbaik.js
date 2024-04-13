const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/karyawan/kepala biro/terbaik')
const middleware = require('../../../middleware/authentication')

router.get('/dataPegawaiTerbaik', middleware.verifyTokenKepala, controllers.pegawaiTerbaik)

module.exports = router