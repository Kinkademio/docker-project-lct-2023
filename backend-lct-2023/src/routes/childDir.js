const router = require('express-promise-router')()

const {childDir} = require('../controllers')

router.route('/:id').get(childDir.get)
router.route('/').post(childDir.create)
router.route('/').get(childDir.getAll)
router.route('/:id').put(childDir.update)
router.route('/:id').delete(childDir.delete)

router.route('/dir/c/').get(childDir.getAllC)
router.route('dir/c/:id').get(childDir.getC)
module.exports = router