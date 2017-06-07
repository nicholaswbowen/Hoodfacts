let mongoose = require('mongoose');
let cityBoundary = new mongoose.Schema({
    name: String,
    bounds: {
      xMin: Number,
      xMax: Number,
      yMin: Number,
      yMax: Number
    },
    geometry: mongoose.Schema.Types.Mixed
});

export const CityBoundaries = mongoose.model('CityBoundaries', cityBoundary);
