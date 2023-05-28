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
  author:{
    type: String,
    default:""
  },
  level:{
    type: String,
    ref: 'Level'
  },
  isFree:{
    type: Boolean,
    default: true,
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