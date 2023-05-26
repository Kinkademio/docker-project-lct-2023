const {model, Schema} = require('mongoose');
var schema = new Schema({
  image_url: {
    type: String,
    default: ""
  },
  author: {
    type: String,
    default:""
  },
  fact_name: {
    type: String,
    default:""
  },
  fact_text: {
    type: String,
    default:""
  },
  fact_footer: {
    type: String,
    default:""
  },
  views: {
    type: Schema.Types.Mixed,
    of: String,
    default: null
  },
  dir:{
    type: Schema.Types.Mixed,
    of: String,
    default: null
  },
});
module.exports = model('Fact', schema)