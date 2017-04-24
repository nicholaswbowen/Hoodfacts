let mongoose = require('mongoose');
let cityTagsMetaData = new mongoose.Schema({
  type: {type:String, index: false},
  subtypes: [String]
});

export const CityTagsMetaData = mongoose.model('city_data_tags_meta_data', cityTagsMetaData);
