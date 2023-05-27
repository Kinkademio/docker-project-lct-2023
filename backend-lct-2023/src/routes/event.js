const router = require('express-promise-router')()

const {event} =require('../controllers')

router.route('/organizator/:id').get(event.getAllForOrganization)
router.route('/actual/organizator/:id').get(event.getAllactualForOrganization)
router.route('/actual/all').get(event.getAllActualEvents)
router.route('/').post(event.create)
router.route('/:id').put(event.update)
router.route('/:id').delete(event.delete)
router.route('/dir/s/del/').post(event.removeDir)
router.route('/dir/s/').post(event.addDir)

router.route('/:id').get(event.get)
router.route('/').get(event.getAll)

router.route('/dir/s/:id').get(event.getD)
router.route('/dir/s/').get(event.getAllD)

module.exports = router