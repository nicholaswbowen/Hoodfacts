let mongoose = require('mongoose');
let stateTagsMetaData = new mongoose.Schema({
  name: {type:String,unique:true},
  type: String,
  subtypes: [String]
});

export const StateTagsMetaData = mongoose.model('state_data_tags_meta_data', stateTagsMetaData);
