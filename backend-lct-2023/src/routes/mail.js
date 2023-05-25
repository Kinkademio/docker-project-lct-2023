const router = require('express-promise-router')()

const {mail} =require('../controllers')

router.route('/send').post(mail.send)

module.exports = router