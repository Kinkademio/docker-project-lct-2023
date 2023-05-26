const router = require('express-promise-router')()

const {event} =require('../controllers')

router.route('/organizator/:id').get(event.getAllForOrganization)
router.route('/actual/organizator/:id').get(event.getAllactualForOrganization)
router.route('/actual/all').get(event.getAllActualEvents)
router.route('/:id').get(event.get)
router.route('/').post(event.create)
router.route('/').get(event.getAll)
router.route('/:id').put(event.update)
router.route('/:id').delete(event.delete)
router.route('/dir/:id').delete(event.removeDir)
router.route('/dir/').post(event.addDir)
module.exports = router