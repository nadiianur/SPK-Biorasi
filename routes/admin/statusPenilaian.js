const express = require('express')
const router = express.Router()
const middleware = require('../../middleware/authentication')
const controllers = require('../../controllers/admin/statusPenilaian')

router.post('/statusPenilaian', middleware.verifyTokenAdmin, controllers.tampilStatus)

module.exports = router