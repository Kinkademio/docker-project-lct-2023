const Router = require('express')
const router = new Router()
const controller = require('../authController')
const {
    check
} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/register', [check('username', "Username dont can is empty").notEmpty(),
    check('password', "Password must be more than 4 characters").isLength({
        min: 4
    })
], controller.registr)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)
router.get('/roles', roleMiddleware(["ADMIN"]), controller.getRoles)
router.put('/updateRole', controller.upadateRole)
router.post('/addRole', controller.addNewRole)
router.post('/delete',roleMiddleware(["ADMIN"]), controller.delete)
router.put('/updatePass', controller.upadateRole)


module.exports = router