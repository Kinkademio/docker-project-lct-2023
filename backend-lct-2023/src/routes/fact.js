const router = require('express-promise-router')()

const {fact} =require('../controllers')



router.route('/:id').get(fact.get)
router.route('/').get(fact.getAll)



router.route('/').post(fact.create)
router.route('/actual/:id').get(fact.getAllActualForUser)

router.route('/:id').put(fact.update)
router.route('/:id').delete(fact.delete)

router.route('/dir/s/del/').post(fact.removeDir)
router.route('/dir/s/').post(fact.addDir)
router.route('/dir/s/:id').get(fact.getD)
router.route('/dir/s/').get(fact.getAllD)

module.exports = router