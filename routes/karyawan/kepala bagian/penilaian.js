const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/karyawan/penilaian')
const middleware = require('../../../middleware/authentication')

router.get('/getNamaKaryawanKabag', middleware.verifyTokenKabag, controllers.tampilNama)
router.get('/detailHasilNamaKabag/:id_detail_generate', middleware.verifyTokenKabag, controllers.detailKaryawan)
router.get('/penilaianKabag/dataKriteria', middleware.verifyTokenKabag, controllers.dataKriteria)
router.post('/penilaianKabag/tambahPenilaian/:id_detail_generate',middleware.verifyTokenKabag, controllers.tambahPenilaian)





module.exports = router