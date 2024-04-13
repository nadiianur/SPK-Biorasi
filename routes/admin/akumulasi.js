const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/admin/akumulasi')
const middleware = require('../../middleware/authentication')

router.post('/akumulasiNilai', middleware.verifyTokenAdmin, controllers.nilaiAkhir)

module.exports = router