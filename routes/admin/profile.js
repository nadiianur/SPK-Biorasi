const express = require('express')
const router = express.Router()
const middleware = require('../../middleware/authentication')
const controllers = require('../../controllers/admin/profile')

router.get('/dataProfileAdmin', middleware.verifyTokenAdmin, controllers.detailAkun)
router.post('/updateProfileAdmin', middleware.verifyTokenAdmin, controllers.updateAkun)


module.exports = router