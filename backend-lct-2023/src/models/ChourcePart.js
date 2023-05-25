const {model, Schema} = require('mongoose');
var schema = new Schema({
  video: {
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
  files:[
    {
        type: String,
        default: ""
    }
  ]
});
module.exports = model('ChourcePart', schema)