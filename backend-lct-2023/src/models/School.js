const {model, Schema} = require('mongoose');
var schema = new Schema({
  image_url: {
    type: String,
    default:""
  },
  name: {
    type: String,
    default:"",
    required: true
  },
  description: {
    type: String,
    default:""
  },
  organization_id:{
    type: Number
  },
  address: {
    address_str: {
      type: String,
      default:""
    },
    comment: {
      type: String,
      default:""
    },
    mapPos: {
      x: {
        type: Number
      },
      y: {
        type: Number
      }
    }
  },
  contacts: {
    web_site: {
      type: String,
      default:""
    },
    mail: {
      type: String,
      default:""
    },
    phone: {
      type: Schema.Types.Mixed,
    }
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
module.exports = model('School', schema)