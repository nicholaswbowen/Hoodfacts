let GeoJSON:any = require('mongoose-geojson-schema');
let mongoose = require('mongoose');
let point = new mongoose.Schema({type: [Number]});
let polygon = new mongoose.Schema({type: [point]});
let polygonGroup = new mongoose.Schema({type: [polygon]});
let Boundary = new mongoose.Schema({
    name: String,
    bounds: {
      xMin: Number,
      xMax: Number,
      yMin: Number,
      yMax: Number
    },
    geometry: mongoose.Schema.Types.Mixed
});

export const CityBoundaries = mongoose.model('CityBoundaries', Boundary);
