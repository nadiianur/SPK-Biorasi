const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/karyawan/kepala bagian/riwayat')
const middleware = require('../../../middleware/authentication')

router.post('/riwayatPenilaianKabag', middleware.verifyTokenKabag, controllers.allPenilaianHistory)

module.exports = router