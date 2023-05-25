const router = require('express-promise-router')()

const {childDir} = require('../controllers')

router.route('/:id').get(childDir.get)
router.route('/').post(childDir.create)
router.route('/').get(childDir.getAll)
router.route('/:id').put(childDir.update)
router.route('/:id').delete(childDir.delete)

module.exports = router