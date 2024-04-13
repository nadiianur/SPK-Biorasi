const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/karyawan/kepala biro/laporan')
const middleware = require('../../../middleware/authentication')

router.post('/dataPenilaianAkhir', middleware.verifyTokenKepala, controllers.nilaiAkhir)
router.get('/dataPeriodeTahun', middleware.verifyTokenKepala, controllers.periodeTahun)
router.get('/dataDetailPenilaian/:id_karyawan/:periode/:tahun', middleware.verifyTokenKepala, controllers.detailPenilaian)
router.get('/generateLaporan/:periode/:tahun', controllers.generateLaporan)

module.exports = router