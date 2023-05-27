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
router.post('/user', roleMiddleware(["ADMIN", "MODERATOR"]), controller.getUser)
router.post('/addRole', roleMiddleware(["ADMIN"]), controller.addNewRole)
router.post('/delete',roleMiddleware(["ADMIN"]), controller.delete)
router.put('/updateUser/:id', roleMiddleware(["ADMIN", "MODERATOR"]), controller.updateUser)
router.post('/deleteRole', roleMiddleware(["ADMIN"]), controller.removeRole)
router.get('/getAgeParams', roleMiddleware(["ADMIN", "MODERATOR"]), controller.getAgeParams)
router.post('/getCreated', roleMiddleware(["ADMIN", "MODERATOR"]), controller.getByDateCreate)
router.put('/updateRole', roleMiddleware(["ADMIN"]), controller.upadateRole)


module.exports = router