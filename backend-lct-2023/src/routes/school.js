const router = require('express-promise-router')()

const {school} = require('../controllers')

router.route('/:id').get(school.get)
router.route('/').post(school.create)
router.route('/').get(school.getAll)
router.route('/:id').put(school.update)
router.route('/:id').delete(school.delete)
router.route('/dir/:id').delete(school.removeDir)
router.route('/dir/').post(school.addDir)

module.exports = router