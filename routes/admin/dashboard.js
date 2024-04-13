const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/admin/dashboard')
const middleware = require('../../middleware/authentication')

router.get('/totalDataPegawai', middleware.verifyTokenAdmin, controllers.totalPegawai)
router.get('/totalDataPenilaian', middleware.verifyTokenAdmin, controllers.penilaian)
router.get('/namaPegawaiTerbaik', middleware.verifyTokenAdmin, controllers.pegawaiTerbaik)
router.get('/totalPegawaiTerbaik', middleware.verifyTokenAdmin, controllers.totalPegawaiTerbaik)


module.exports = router