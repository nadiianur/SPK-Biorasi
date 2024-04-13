const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/admin/kriteria')
const middleware = require('../../middleware/authentication')

router.post('/tambahKriteria', middleware.verifyTokenAdmin, controllers.tambahKriteria)
router.get('/dataKriteria', middleware.verifyTokenAdmin, controllers.tampilKriteria)
router.get('/detailKriteria/:id_kriteria', middleware.verifyTokenAdmin, controllers.detailKriteria)
router.post('/editKriteria/:id_kriteria', middleware.verifyTokenAdmin, controllers.editKriteria)
router.delete('/hapusKriteria/:id_kriteria', middleware.verifyTokenAdmin, controllers.hapusKriteria)

module.exports = router