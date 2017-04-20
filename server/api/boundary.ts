import * as express from 'express';
import {placesData} from '../lib/googlePlaces';
import {CityBoundaries} from '../models/CityBoundary';
import {StateBoundaries} from '../models/StateBoundary';
let router = express.Router();

function checkBounds(bounds,yMin,xMin,yMax,xMax){
  let checkyMin = (bounds.yMin >= yMin && bounds.yMin <= yMax);
  let checkxMin = (bounds.xMin >= xMin && bounds.xMin <= xMax);
  let checkyMax = (bounds.yMax >= yMin && bounds.yMax <= yMax);
  let checkxMax = (bounds.xMax >= xMin && bounds.xMax <= xMax);
  return (checkyMin && checkxMin || checkyMax && checkxMax);
}

router.get('/boundary', function(req, res, next) {
  let query = {
  $or: [
    {'bounds.yMin': {$gte:req.query.yMin, $lte:req.query.yMax},
    'bounds.xMin': {$gte:req.query.xMin, $lte:req.query.xMax}},

    {'bounds.xMax': {$gte:req.query.xMin, $lte:req.query.xMax},
    'bounds.yMax': {$gte:req.query.yMin, $lte:req.query.yMax}}],
 };
 let activeModel;
 if (req.query.searchBy === 'cities'){
    activeModel = CityBoundaries;
 }
 else if (req.query.searchBy === 'states'){
   console.log(req.query.searchBy);
   activeModel = StateBoundaries;
 }
  let extractQueue = [];
  // let resolveQueue:any = () => {
  //   return () => {
  //     extractQueue.forEach((city) => {
  //       res.write(`{"name": "${city.name}", "data":"${data.extractCityData(city.bounds)}"}`);
  //     })
  //     res.end();
  //   }
  // }
  // let resolveResponseStream = () => {
  //   resolveQueue = resolveQueue();
  // }
  let borders = activeModel.find(query).cursor();
  // data.makeQuery('food',req.query.center,50000)
  //   .then(() => resolveResponseStream());
  if (req.query.exclude === "true"){
    borders.on('data', (boundary) => {

      if (checkBounds(boundary.bounds,req.query.eyMin,req.query.exMin,req.query.eyMax,req.query.exMax)){
        //exclude this
        return;
      }else{
        //send this
        // extractQueue.push(boundary);
        return res.write(JSON.stringify(boundary));
      }
    })
    .on('end', (d) => {
      return res.end();
      // return resolveResponseStream();
    })
  }else{
    borders.on('data', (boundary) => {
      //inital fetch
      // extractQueue.push(boundary);
      return res.write(JSON.stringify(boundary));
    })
    .on('end', () => {
      return res.end();
      // return resolveResponseStream();
    })
  }

})

export = router;
