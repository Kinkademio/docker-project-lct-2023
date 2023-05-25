const genericCrud = require('./GenericController')
const {ChildDirection} = require('../models');
module.exports ={
    ...genericCrud(ChildDirection),
}