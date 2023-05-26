const router = require('express-promise-router')()

const {fact} =require('../controllers')

router.route('/:id').get(fact.get)
router.route('/').get(fact.getAll)

router.route('/dir/:id').get(fact.getD)
router.route('/dir').get(fact.getAllD)

router.route('/').post(fact.create)
router.route('/actual/:id').get(fact.getAllActualForUser)

router.route('/:id').put(fact.update)
router.route('/:id').delete(fact.delete)
router.route('/dir/:id').delete(fact.removeDir)
router.route('/dir/').post(fact.addDir)

module.exports = router