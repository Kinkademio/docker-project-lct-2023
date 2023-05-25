const genericCrud = require('./GenericController')
const {Direction} = require('../models');
module.exports ={
    ...genericCrud(Direction),
}