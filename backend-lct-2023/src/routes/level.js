const router = require('express-promise-router')()

const {level} = require('../controllers')

router.route('/:id').get(level.get)
router.route('/').post(level.create)
router.route('/').get(level.getAll)
router.route('/:id').put(level.update)
router.route('/:id').delete(level.delete)

module.exports = router