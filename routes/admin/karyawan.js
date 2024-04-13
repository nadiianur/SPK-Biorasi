const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/admin/karyawan')
const middleware = require('../../middleware/authentication')

router.post('/tambahKaryawan', middleware.verifyTokenAdmin, controllers.tambahKaryawan)
router.post('/editKaryawan/:id_karyawan', middleware.verifyTokenAdmin, controllers.editKaryawan)
router.get('/detailKaryawan/:id_karyawan', middleware.verifyTokenAdmin, controllers.detailKaryawan)
router.get('/dataKaryawan', middleware.verifyTokenAdmin, controllers.tampilKaryawan)
router.delete('/hapusKaryawan/:id_karyawan', middleware.verifyTokenAdmin, controllers.hapusKaryawan)

module.exports = router