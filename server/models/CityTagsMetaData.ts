let mongoose = require('mongoose');
let cityTagsMetaData = new mongoose.Schema({
  name: {type:String,unique:true},
  type: String,
  subtypes: [String]
});

export const CityTagsMetaData = mongoose.model('city_data_tags_meta_data', cityTagsMetaData);
