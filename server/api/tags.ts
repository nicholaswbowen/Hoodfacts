import * as express from 'express';
import {CityTagsMetaData} from '../models/CityTagsMetaData';
import {StateTagsMetaData} from '../models/StateTagsMetaData';
let router = express.Router();

router.get('/tags', (req, res, next) => {
  let model;
  if (req.query.tagType === 'states'){
    model = StateTagsMetaData;
  }else if (req.query.tagType === 'city'){
    model = CityTagsMetaData;
  }else{
    res.write(JSON.stringify({message: "invalid or missing tag type"}))
    return res.end();
  }
  model.find()
    .then((tags) => {
      res.write(JSON.stringify(tags));
      return res.end();
    })
})
export = router;
