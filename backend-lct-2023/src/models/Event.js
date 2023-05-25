const {model, Schema} = require('mongoose');
var schema = new Schema({
  img_url: {
    type: String,
    default:""
  },
  name: {
    type: String,
    default:""
  },
  url: {
    type: String,
    default:""
  },
  date_start: {
    type: Date
  },
  date_end: {
    type: Date
  },
  descripton: {
    type: String,
    default:""
  },
  organization_id:{
    type: Number
  },
  organization_name:{
    type: String,
    default:""
  },
  api_id:{
    type: String,
    default:""
  },
  isFree:{
    type: Boolean
  },
  views: {
    type: Schema.Types.Mixed,
    of: String,
    default: null
  },
  dir:[{
    type: String,
    ref: 'Direction'
  }],
});
module.exports = model('Event', schema)