let mongoose = require('mongoose');
let cityDataTag = new mongoose.Schema({
  locationName: {type:String,unique:true},
  state: String,
  type: String,
  subtype: String,
  data: Number,
  reference: String,
  owner: String
});

export const CityDataTag = mongoose.model('city_data_tags', cityDataTag);
