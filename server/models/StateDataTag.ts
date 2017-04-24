let mongoose = require('mongoose');
let stateDataTag = new mongoose.Schema({
  locationName: {type:String,unique:true},
  type: String,
  subtype: String,
  data: Number,
  reference: String,
  owner: String
});

export const StateDataTag = mongoose.model('state_data_tags', stateDataTag);
