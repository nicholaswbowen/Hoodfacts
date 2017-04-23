import * as express from 'express';
import {CityBoundaries} from '../models/CityBoundary';
import {StateBoundaries} from '../models/StateBoundary';
import {StateDataTag} from '../models/StateDataTag';
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
   activeModel = StateBoundaries;
 }
  let extractQueue = [];
  let resolveQueue:any = () => {

  }
  let resolveResponseStream = () => {
    resolveQueue = resolveQueue();
  }
  let borders = activeModel.find(query).cursor();
  if (req.query.exclude === "true"){
    borders.on('data', (place) => {
      if (checkBounds(place.bounds,req.query.eyMin,req.query.exMin,req.query.eyMax,req.query.exMax)){
        //exclude this
        return;
      }else{
        //send this
        extractQueue.push(
          StateDataTag.findOne({'locationName': place.name, 'subtype': "high_school"})
            .then((result) => {
              res.write(`{"name":"${place.name}", "data":"${result.data}"}`);
            })
            .catch((e) => {

            })
          );
        return res.write(JSON.stringify(place));
      }
    })
    .on('end', (d) => {
      Promise.all(extractQueue)
        .then(()=> {

          res.end();
        })
    })
  }else{
    borders.on('data', (place) => {
      //inital fetch
      extractQueue.push(
        StateDataTag.findOne({'locationName': place.name, 'subtype': "high_school"})
          .then((result) => {
            res.write(`{"name":"${place.name}", "data":"${result.data}"}`);
          })
          .catch((e) => {
            console.log(`error caught on ${place.name}`)
          })
        );
      return res.write(JSON.stringify(place));
    })
    .on('end', () => {
      Promise.all(extractQueue)
        .then(()=> {
          console.log('res ended')
          res.end();
        })
    })
  }
})

export = router;
