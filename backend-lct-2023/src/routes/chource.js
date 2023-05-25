const router = require('express-promise-router')()

const {chource} = require('../controllers')

router.route('/:id').get(chource.get)
router.route('/').post(chource.create)
router.route('/').get(chource.getAll)
router.route('/:id').put(chource.update)
router.route('/:id').delete(chource.delete)

module.exports = router