const router = require('express-promise-router')()

const {chource} = require('../controllers')


router.route('/:id').get(chource.get)
router.route('/').get(chource.getAll)

router.route('/dir/s/:id').get(chource.getD)
router.route('/dir/s').get(chource.getAllD)

router.route('/').post(chource.create)
router.route('/:id').put(chource.update)
router.route('/:id').delete(chource.delete)
router.route('/dir/s/del/').post(chource.removeDir)
router.route('/dir/s/').post(chource.addDir)
module.exports = router