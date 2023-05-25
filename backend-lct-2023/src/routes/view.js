const router = require('express-promise-router')()

const {view} = require('../controllers')

router.route('/').post(view.create)
module.exports = router