const exrpess = require('express')
const router = exrpess.Router()
const controllers = require('../../controllers/karyawan/akun')

router.post('/loginKaryawan', controllers.loginKaryawan)
router.delete('/logoutKaryawan', controllers.logoutKaryawan)

module.exports = router