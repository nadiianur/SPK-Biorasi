const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/karyawan/penilaian')
const middleware = require('../../middleware/authentication')

router.get('/getNamaKaryawan', middleware.verifyTokenKaryawan, controllers.tampilNama)
router.get('/detailHasilNama/:id_detail_generate', middleware.verifyTokenKaryawan, controllers.detailKaryawan)
router.get('/penilaian/dataKriteria', middleware.verifyTokenKaryawan, controllers.dataKriteria)
router.post('/penilaian/tambahPenilaian/:id_detail_generate', controllers.tambahPenilaian)

module.exports = router