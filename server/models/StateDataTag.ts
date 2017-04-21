let mongoose = require('mongoose');
let stateDataTag = new mongoose.Schema({
  name: String,
  type: String,
  data: Number,
  reference: String,
  owner: String
});

export const StateDataTag = mongoose.model('state_data_tags', stateDataTag);
