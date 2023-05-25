const {model, Schema} = require('mongoose');
var schema = new Schema({
  name:{
    type: String,
  },
  parent:{
    type: String,
  }
});
module.exports = model('ChildDirection', schema)