const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/admin/generate')
const middleware = require('../../middleware/authentication')

router.post('/generate', middleware.verifyTokenAdmin, controllers.generate)

module.exports = router