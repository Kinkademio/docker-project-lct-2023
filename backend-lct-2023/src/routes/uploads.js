const router = require('express-promise-router')()

const {uploads} =require('../controllers')

router.route('/create/').post(uploads.create)
router.route('/*').get(uploads.get)


module.exports = router