const router = require('express-promise-router')()

const {news} = require('../controllers')

router.route('/').post(news.create)
router.route('/:id').put(news.update)
router.route('/:id').delete(news.delete)
router.route('/dir/:id').delete(news.removeDir)
router.route('/dir/').post(news.addDir)

router.route('/:id').get(news.get)
router.route('/').get(news.getAll)

router.route('/dir/:id').get(news.getD)
router.route('/dir').get(news.getAllD)
module.exports = router