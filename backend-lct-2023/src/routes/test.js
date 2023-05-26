const router = require('express-promise-router')()

const {test} = require('../controllers')

router.route('/').post(test.create)
router.route('/:id').put(test.update)
router.route('/:id').delete(test.delete)
router.route('/dir/s/:id').delete(test.removeDir)
router.route('/dir/s/').post(test.addDir)

router.route('/:id').get(test.get)
router.route('/').get(test.getAll)

router.route('/dir/s/:id').get(test.getD)
router.route('/dir').get(test.getAllD)
module.exports = router