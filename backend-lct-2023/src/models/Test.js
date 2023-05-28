const {model, Schema} = require('mongoose');
var schema = new Schema({
  image_url: {
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
  level:{
    type: String,
    ref: 'Level'
  },
  dir:{
    type: Schema.Types.Mixed,
    of: String,
    default: []
  },
  tasks:{
    type: Schema.Types.Mixed,
    of: String,
    default: []
  }
});
module.exports = model('Test', schema)