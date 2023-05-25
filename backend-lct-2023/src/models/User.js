const {model, Schema} = require('mongoose');
var schema = new Schema({
  school_views: {
    type: Schema.Types.Mixed,
    of: String,
    default: null
  },
  event_views: {
    type: Schema.Types.Mixed,
    of: String,
    default: null
  },
  fact_views: {
    type: Schema.Types.Mixed,
    of: String,
    default: null
  },
  authorization_id:{
    type: String
  },
  create_date:{
    type: Date,
    default: new Date()
  }
});
module.exports = model('User', schema)