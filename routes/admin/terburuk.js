const express = require('express')
const router = express.Router()
const middleware = require('../../middleware/authentication')
const controllers = require('../../controllers/admin/terburuk')

router.post('/pegawaiTerburuk', middleware.verifyTokenAdmin, controllers.pegawaiTerburuk)
router.get('/allPegawaiTerburuk', middleware.verifyTokenAdmin, controllers.allPegawaiTerburuk)


module.exports = router