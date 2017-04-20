import * as GooglePlaces from 'node-googleplaces';
//
export class placesData{
private Places;
public queryData;
  constructor(){
    this.Places = new GooglePlaces(process.env.GOOGLE_PLACES_API_KEY);
  }
  public extractCityData(bounds){

      let ratings:number = 0;
      let ratingsCount:number = 0;
      this.queryData.forEach((place) => {
        if (this.checkBounds(bounds,place.geometry.location)){
          ratings += place.rating;
          ratingsCount++;
        }
      })
      if (ratingsCount === 0){
        return "no data";
      }else{
        return (ratings/ratingsCount);
      }
  }
  private checkBounds(bounds,point){
    let checkX = (point.lat <= bounds.xMax && point.lat >= bounds.xMin);
    let checkY = (point.lng <= bounds.yMax && point.lng >= bounds.yMin);
    return (checkX && checkY);
  }
  public makeQuery(keyword, location, radius){
    return new Promise((resolve,reject) => {
      const params = {
        keyword,
        location: location.replace(/[\(\)\s]/g,''),
        radius
      };
      this.Places.radarSearch(params)
      .then((res) => {
        //  console.log(res.body.results);
        this.queryData = res.body.results;
        resolve();
      })
      .catch((err) => {
        reject();
      })
    })

  }
}
