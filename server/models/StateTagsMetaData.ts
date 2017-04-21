let mongoose = require('mongoose');
let stateTagsMetaData = new mongoose.Schema({
  name: {type:String,unique:true},
  type: String,
  subtype: String,
  data: Number,
  reference: String,
  owner: String
});

export const StateTagsMetaData = mongoose.model('state_data_tags_meta_data', stateTagsMetaData);
