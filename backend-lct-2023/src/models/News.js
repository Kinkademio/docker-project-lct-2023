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
  dir:{
    type: Schema.Types.Mixed,
    of: String,
    default: []
  },
  views: {
    type: Schema.Types.Mixed,
    of: String,
    default: null
  }
});
module.exports = model('News', schema)