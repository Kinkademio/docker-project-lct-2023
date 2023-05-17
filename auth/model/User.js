const {
    Schema,
    model
} = require('mongoose')


const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true,
        default: "User"
    },
    password: {
        type: String,
        required: true
    },
    anonid:{
        type:String,
        default: ""
    },
    registrDate:{
        type: Number,
        default: new Date().now(),
        required: true
    },
    age:{
        type: String,
      },
    roles: [{
        type: String,
        ref: 'Role'
    }]
})

module.exports = model('User', User)