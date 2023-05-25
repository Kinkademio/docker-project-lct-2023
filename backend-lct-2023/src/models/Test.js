const {model, Schema} = require('mongoose');
var schema = new Schema({
  start_video: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default:""
  },
  text: {
    type: String,
    default:""
  },
  dir:[{
    type: String,
    ref: 'Direction'
  }]
});
module.exports = model('Test', schema)