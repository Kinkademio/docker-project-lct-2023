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
  dir:{
    type: Schema.Types.Mixed,
    of: String,
    default: []
  },
  videos:[{
    type: String,
    ref: 'ChourcePart'
  }]
});
module.exports = model('Chource', schema)