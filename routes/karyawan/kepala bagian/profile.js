const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/karyawan/profile')
const middleware = require('../../../middleware/authentication')
const controllersAkun = require('../../../controllers/karyawan/akun')

router.get('/dataProfileKabag', middleware.verifyTokenKabag, controllers.detailAkun)
router.post('/updateProfileKabag', middleware.verifyTokenKabag, controllers.updateProfileKaryawan)
router.delete('/logoutKabag', middleware.verifyTokenKabag, controllersAkun.logoutKaryawan)


module.exports = router