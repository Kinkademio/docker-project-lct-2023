const router = require('express-promise-router')()

const {test} = require('../controllers')

router.route('/:id').get(test.get)
router.route('/').post(test.create)
router.route('/').get(test.getAll)
router.route('/:id').put(test.update)
router.route('/:id').delete(test.delete)

module.exports = router