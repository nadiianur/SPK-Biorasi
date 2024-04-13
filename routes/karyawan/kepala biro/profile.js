const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/karyawan/profile')
const middleware = require('../../../middleware/authentication')
const controllersAkun = require('../../../controllers/karyawan/akun')


router.get('/dataProfileBiro', middleware.verifyTokenKepala, controllers.detailAkun)
router.post('/updateProfileBiro', middleware.verifyTokenKepala, controllers.updateProfileKaryawan)
router.delete('/logoutBiro', middleware.verifyTokenKepala, controllersAkun.logoutKaryawan)

module.exports = router