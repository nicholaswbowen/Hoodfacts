let mongoose = require('mongoose');
let stateBoundary = new mongoose.Schema({
    name: String,
    bounds: {
      xMin: Number,
      xMax: Number,
      yMin: Number,
      yMax: Number
    },
    geometry: mongoose.Schema.Types.Mixed
});

export const StateBoundaries = mongoose.model('stateboundaries', stateBoundary);
