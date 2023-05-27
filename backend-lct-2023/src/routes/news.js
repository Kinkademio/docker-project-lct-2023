const router = require('express-promise-router')()

const {news} = require('../controllers')

router.route('/').post(news.create)
router.route('/:id').put(news.update)
router.route('/:id').delete(news.delete)
router.route('/dir/s/del/').post(news.removeDir)
router.route('/dir/s/').post(news.addDir)

router.route('/:id').get(news.get)
router.route('/').get(news.getAll)

router.route('/dir/s/:id').get(news.getD)
router.route('/dir/s/').get(news.getAllD)
module.exports = router