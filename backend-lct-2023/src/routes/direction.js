const router = require('express-promise-router')()

const {direction} = require('../controllers')

router.route('/:id').get(direction.get)
router.route('/').post(direction.create)
router.route('/').get(direction.getAll)
router.route('/:id').put(direction.update)
router.route('/:id').delete(direction.delete)

module.exports = router