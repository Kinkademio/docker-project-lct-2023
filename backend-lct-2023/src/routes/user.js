const router = require('express-promise-router')()

const {user} = require('../controllers')

router.route('/:id').get(user.get)
router.route('/').post(user.create)
router.route('/').get(user.getAll)
router.route('/:id').put(user.update)
router.route('/:id').delete(user.delete)
router.route('/getCreated/').post(user.getAllByDate)

module.exports = router