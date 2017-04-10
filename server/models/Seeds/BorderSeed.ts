import * as mongoose from 'mongoose';
import {CityBoundaries} from '../CityBoundary';
import * as oboe from 'oboe';
let fs = require('fs');
let count = 0;
let BorderSeed = () =>{
  oboe(fs.createReadStream('USDataFinal.geojson', 'utf8'))
    .on('node','{name geometry}', (data) => {

      // console.log(`loaded ${data.name}`);
      console.log(++count);

    })
}
mongoose.connect('mongodb://localhost:27017/hoodfacts')
  .then(() => {
    CityBoundaries.create()
      .then((result) => {
        BorderSeed();
      })

  }).catch((e) => {
    console.log(e);
  });
