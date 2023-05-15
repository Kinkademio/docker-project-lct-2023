const User = require('./model/User')
const Roles = require('./model/Roles')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    validationResult
} = require('express-validator')
const {
    secret
} = require('./config')

const generateAccesToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {
        expiresIn: "24h"
    })
}

class authController {
    async registr(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при регистрации",
                    errors
                })
            }
            const {
                name,
                username,
                password
            } = req.body
            const candidate = await User.findOne({
                username
            })
            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именнем уже существует"
                })
            }
            const userRole = await Roles.findOne({
                value: "ADMIN"
            })
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({
                username,
                name,
                password: hashPassword,
                roles: [userRole.value]
            })
            await user.save()
            return res.json({
                message: "Регистарция прошлав успешно"
            })
        } catch (error) {
            console.log(error)
        }
    }
    async login(req, res) {
        try {
            const {
                username,
                password
            } = req.body
            const user = await User.findOne({
                username
            })
            if (!user) {
                return res.status(400).json({
                    message: `Пользовательс таким имем ${username} не найден`
                })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({
                    message: `Пароль не правильный`
                })
            }
            const name = user.name
            const token = generateAccesToken(user._id, user.roles)
            return res.json({
                token:token,
                name:name
            })

        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: 'Ошибка при авторизации'
            })
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(403).json({
                message: 'Пользователь не авторизован'
            })
        }
    }
    async getUser(req, res) {
        const {
            username
        } = req.body
        const user = await User.findOne({
            username
        })
        try {
            res.json(user)
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: 'Пользователь не найден'
            })
        }
    }
    async getRoles(req, res) {
        try {
            const users = await Roles.find()
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(403).json({
                message: 'Пользователь не авторизован'
            })
        }
    }
    async upadateRole(req, res) {
        const {
            id,
            newRole
        } = req.body
        try {
            await User.findByIdAndUpdate(id, {
                roles: newRole
            });
            res.status(200).json({
                message: "Роль пользователя успешно обновлена"
            });
        } catch (err) {
            res.status(404).json({
                message: err.message
            });
        }
    }
    async addNewRole(req, res) {
        try {
            const {
                rolesName
            } = req.body
            const role = await Roles.findOne({
                rolesName
            })
            if (role) {
                return res.json({
                    message: `Такая роль уже есть`
                })
            }
            const roles = new Roles({
                value: rolesName
            })
            await roles.save()
            res.status(200).json({
                message: 'Роль успешно создана'
            })

        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: 'Ошибка при добавлении новой роли'
            })
        }
    }
    async delete(req, res) {
        const {
            id,
        } = req.body
        try {
            let deleted = await User.findByIdAndDelete(id);
            res.status(200).json({
                message: "Пользователь удален!",
            });
        } catch (err) {
            res.status(404).json({
                message: "Ошибка при удалении пользователя"
            });
        }
    }
    async updatePass(req, res) {
        const {
            id,
            newPass
        } = req.body
        
        try {
            const hashPassword = bcrypt.hashSync(newPass, 7);
            await User.findByIdAndUpdate(id, {
                password: hashPassword
            });
            res.status(200).json({
                message: "Пароль обновлен"
            });
        } catch (err) {
            res.status(404).json({
                message: "Ошибка обновления пароля"
            });
        }
    }
    async updateUserName(req, res) {
        const {
            id,
            name
        } = req.body
        
        try {
            await User.findByIdAndUpdate(id, {
                name: name
            });
            res.status(200).json({
                message: "Пароль обновлен"
            });
        } catch (err) {
            res.status(404).json({
                message: "Ошибка обновления пароля"
            });
        }
    }
}

module.exports = new authController()