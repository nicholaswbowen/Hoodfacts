import * as express from 'express';
let fs = require("fs");
let router = express.Router();

router.get('/boundary', function(req, res, next) {
  let file = fs.readFileSync('redmondSimplified.geojson','utf8');
  let file2 = fs.readFileSync('kirkland.geojson','utf8');
  let file3 = fs.readFileSync('bellevue.geojson','utf8');
  return res.json({file,file2,file3});
});

export = router;
