import * as GooglePlaces from 'node-googleplaces';
//
export class placesData{
private Places;
  constructor(query, location, radius){
    this.Places = new GooglePlaces(process.env.GOOGLE_PLACES_API_KEY);
    this.makeQuery(query, location, radius);
  }
  private generateRadius(){

  }
  public makeQuery(keyword, location, radius){
    const params = {
      keyword,
      location: location.replace(/[\(\)\s]/g,''),
      radius
    };
    this.Places.nearbySearch(params)
    .then((res) => {
      console.log('res =')
      console.log(res.body);
    })
    .catch((err) => {
      console.log('err =')
      console.log(err);
    })
  }
}
