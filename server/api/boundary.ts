import * as express from 'express';
import * as JSONStream from 'JSONStream';
import {CityBoundaries} from '../models/CityBoundary';
let fs = require('fs');
let router = express.Router();

router.get('/boundary', function(req, res, next) {
  let query;
  if (req.query.searchBy === 'bounds'){
    console.log(req.query);
    query = { $or: [
    {'bounds.yMin': {$gte:req.query.yMin, $lte:req.query.yMax},
    'bounds.xMin': {$gte:req.query.xMin, $lte:req.query.xMax}},

    {'bounds.xMax': {$gte:req.query.xMin, $lte:req.query.xMax},
    'bounds.yMax': {$gte:req.query.yMin, $lte:req.query.yMax}}
    ]
  }
}
  let borders = CityBoundaries.find(query).cursor().pipe(JSONStream.stringify()).pipe(res);
  // console.log(query);
  // CityBoundaries.find(query)
  //   .then((result) => {
  //     console.log(result);
  //     return res.json(result);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
})

export = router;
