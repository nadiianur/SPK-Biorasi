const express =require('express')
const router = express.Router()
const controllers = require('../../controllers/karyawan/profile')
const middleware = require ('../../middleware/authentication')

router.get('/dataProfileKaryawan', middleware.verifyTokenKaryawan, controllers.detailAkun)
router.post('/updateProfileKaryawan', middleware.verifyTokenKaryawan, controllers.updateProfileKaryawan)

module.exports = router