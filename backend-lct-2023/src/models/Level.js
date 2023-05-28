const {model, Schema} = require('mongoose');
var schema = new Schema({
  name:{
    type: String,
  },
  color:{
    type: String,
  }
});
module.exports = model('Level', schema)