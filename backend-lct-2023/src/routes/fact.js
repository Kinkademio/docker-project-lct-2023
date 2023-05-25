const router = require('express-promise-router')()

const {fact} =require('../controllers')

router.route('/:id').get(fact.get)
router.route('/').post(fact.create)
router.route('/actual/:id').get(fact.getAllActualForUser)
router.route('/').get(fact.getAll)
router.route('/:id').put(fact.update)
router.route('/:id').delete(fact.delete)

module.exports = router