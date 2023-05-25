const router = require('express-promise-router')()

const {news} = require('../controllers')

router.route('/:id').get(news.get)
router.route('/').post(news.create)
router.route('/').get(news.getAll)
router.route('/:id').put(news.update)
router.route('/:id').delete(news.delete)

module.exports = router