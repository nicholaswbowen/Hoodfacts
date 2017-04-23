import * as express from 'express';
import {CityBoundaries} from '../models/CityBoundary';
import {StateBoundaries} from '../models/StateBoundary';
import {StateDataTag} from '../models/StateDataTag';
import {CityDataTag} from '../models/CityDataTag';
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
 let activeBoundaryModel;
 let activeDataModel;
 if (req.query.searchBy === 'cities'){
    activeBoundaryModel = CityBoundaries;
    activeDataModel = CityDataTag;
 }
 else if (req.query.searchBy === 'states'){
   activeBoundaryModel = StateBoundaries;
   activeDataModel = StateDataTag;
 }
  let extractQueue = [];
  let borders = activeBoundaryModel.find(query).cursor();
  let addToQueue = (place) => {
    //push all the promises into an array so we know when to end the response.
    extractQueue.push(
      activeDataModel.findOne({'locationName': place.name, 'subtype': "high_school"})
        .then((result) => {
          res.write(`{"name":"${place.name}", "data":"${result.data}"}`);
        })
        .catch((e) => {

        })
      );
  }
  let resolveQueue = () => {
    //end the response once the promises resolve
    Promise.all(extractQueue)
      .then(()=> {
        res.end();
      })
  }
  if (req.query.exclude === "true"){
    // if we are excluding, attach is stream handler;
    borders.on('data', (place) => {
      if (checkBounds(place.bounds,req.query.eyMin,req.query.exMin,req.query.eyMax,req.query.exMax)){
        return;
      }else{
        addToQueue(place);
        return res.write(JSON.stringify(place));
      }
    })
    .on('end', (d) => {
      //once the cursor closes itself, we know that there are not any more data calls that need to be made, so we can call resolveQueue();
      resolveQueue();
    })
  }else{
    // if we aren't excluding, attach is stream handler
    borders.on('data', (place) => {
      addToQueue(place);
      return res.write(JSON.stringify(place));
    })
    .on('end', () => {
      resolveQueue();
    })
  }
})

export = router;
