let mongoose = require('mongoose');
let cityDataTag = new mongoose.Schema({
  name: String,
  type: String,
  data: Number,
  reference: String,
  owner: String
});

export const CityDataTag = mongoose.model('city_data_tags', cityDataTag);
