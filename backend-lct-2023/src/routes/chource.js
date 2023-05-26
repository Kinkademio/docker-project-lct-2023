const router = require('express-promise-router')()

const {chource} = require('../controllers')

router.route('/:id').get(chource.get)
router.route('/').post(chource.create)
router.route('/').get(chource.getAll)
router.route('/:id').put(chource.update)
router.route('/:id').delete(chource.delete)
router.route('/dir/:id').delete(chource.removeDir)
router.route('/dir/').post(chource.addDir)
module.exports = router