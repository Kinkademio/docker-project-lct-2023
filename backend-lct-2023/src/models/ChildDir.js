const {model, Schema} = require('mongoose');
var schema = new Schema({
  name:{
    type: String,
  },
  parent:{
    type: String,
  },
  color: {
    type: String
  }
});
module.exports = model('ChildDirection', schema)