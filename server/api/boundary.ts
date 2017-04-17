import * as express from 'express';
import {placesData} from '../lib/googlePlaces';
import {twitterData} from '../lib/twitterData';
import {CityBoundaries} from '../models/CityBoundary';
let router = express.Router();

function checkBounds(bounds,yMin,xMin,yMax,xMax){
  let checkyMin = (bounds.yMin >= yMin && bounds.yMin <= yMax);
  let checkxMin = (bounds.xMin >= xMin && bounds.xMin <= xMax);
  let checkyMax = (bounds.yMax >= yMin && bounds.yMax <= yMax);
  let checkxMax = (bounds.xMax >= xMin && bounds.xMax <= xMax);
  return (checkyMin && checkxMin || checkyMax && checkxMax);
}

router.get('/boundary', function(req, res, next) {
  let query;
  if (req.query.searchBy === 'bounds'){
    query = {
    $or: [
      {'bounds.yMin': {$gte:req.query.yMin, $lte:req.query.yMax},
      'bounds.xMin': {$gte:req.query.xMin, $lte:req.query.xMax}},

      {'bounds.xMax': {$gte:req.query.xMin, $lte:req.query.xMax},
      'bounds.yMax': {$gte:req.query.yMin, $lte:req.query.yMax}}],
   }
}
  //lat: 47.673988, lng:-122.121513
  console.log(`center = ${req.query.center}`)
  let data = new placesData('taco',req.query.center,10000);
  let borders = CityBoundaries.find(query).cursor();
  if (req.query.exclude === "true"){
    borders.on('data', (d) => {
      if (checkBounds(d.bounds,req.query.eyMin,req.query.exMin,req.query.eyMax,req.query.exMax)){
        //exclude this
        return;
      }else{
        //send this
        // console.log(data.checkCityData(d.bounds));
        return res.write(JSON.stringify(d));
      }
    })
    .on('end', (d) => {
      return res.end();
    })
    .on('readable', () => {
    })
  }else{
    borders.on('data', (d) => {
      //inital fetch
      return res.write(JSON.stringify(d));
    })
    .on('end', (d) => {
      return res.end();
    })
  }

})

export = router;
