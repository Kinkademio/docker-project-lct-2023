const router = require('express-promise-router')()

const {school} = require('../controllers')

router.route('/').post(school.create)
router.route('/:id').put(school.update)
router.route('/:id').delete(school.delete)
router.route('/dir/s/:id').delete(school.removeDir)
router.route('/dir/s/').post(school.addDir)

router.route('/:id').get(school.get)
router.route('/').get(school.getAll)

router.route('/dir/s/:id').get(school.getD)
router.route('/dir').get(school.getAllD)
module.exports = router