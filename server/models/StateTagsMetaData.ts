let mongoose = require('mongoose');
let stateTagsMetaData = new mongoose.Schema({
  type: String,
  subtypes: [String]
});

export const StateTagsMetaData = mongoose.model('state_data_tags_meta_data', stateTagsMetaData);
