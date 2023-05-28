const genericCrud = require('./GenericController')
const {Level} = require('../models');
module.exports ={
    ...genericCrud(Level),
}