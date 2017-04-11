import * as oboe from 'oboe';
declare var canvas;
declare var google;
class boundaryLayer{
  public test = 0;
  public overlayProjection;
  public boundaryOverlay;
  public canvas;
  public ctx;
  public $http;
  public cities;
  public ne;
  public sw;
  public lastViewBounds:any = {};
  public viewBounds:any = {};
  constructor(overlayProjection,canvas,$localStorage,ne,sw){
    let self = this;
    this.overlayProjection = overlayProjection;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.cities = [];
    this.ne = ne;
    this.sw = sw;
    this.getBoundaries();
    console.log($localStorage);
  }
  public ProjectBorder(city){
    let projectedBorder = [];
    city.geometry.coordinates.forEach((polygon) => {
      projectedBorder.push(
        polygon[0].map((point) => {
          let coords = new google.maps.LatLng(point[1], point[0]);
          return this.overlayProjection.fromLatLngToContainerPixel(coords);
      }));
    });
    return projectedBorder;
  }
  public getBoundaries(){
    //check localstorage for boundaries already fetched
    //create a query to fetch mising boundaries based on current map position
    //return the query promise.
    //maybe cram oboe in here. I do what I want ¯\_(ツ)_/¯

    // check boundaries in localstorage,
    const OFFSET = 0.1;
    this.viewBounds.xMax = this.ne.lat()+OFFSET;
    this.viewBounds.yMax = this.ne.lng()+OFFSET;
    this.viewBounds.xMin = this.sw.lat()-OFFSET;
    this.viewBounds.yMin = this.sw.lng()-OFFSET;
    let boundsQuery = `&xMax=${this.viewBounds.xMax}&yMax=${this.viewBounds.yMax}&xMin=${this.viewBounds.xMin}&yMin=${this.viewBounds.yMin}`
    oboe({url: `/api/boundary/?searchBy=bounds${boundsQuery}`})
      .on('node','{name}',(d) => {
      window.localStorage.setItem(d.name,JSON.stringify(d));
      return oboe.drop;
      })
    console.time('fetchFromLocal')
    for (let i = 0; i < localStorage.length; i++){
      let fetchBorder = new Promise((resolve,reject) => {
        resolve(localStorage.getItem(localStorage.key(i)));
      })
      .then((result) => {
        this.drawBorder(result);
      })
    }
    console.timeEnd('fetchFromLocal');
  }
  public checkBounds(bounds){
    let checkyMin = (bounds.yMin >= this.viewBounds.yMin && bounds.yMin <= this.viewBounds.yMax);
    let checkxMin = (bounds.xMin >= this.viewBounds.xMin && bounds.xMin <= this.viewBounds.xMax);
    let checkyMax = (bounds.yMax >= this.viewBounds.yMin && bounds.yMax <= this.viewBounds.yMax);
    let checkxMax = (bounds.xMax >= this.viewBounds.xMin && bounds.xMax <= this.viewBounds.xMax);
    return (checkyMin && checkxMin || checkyMax && checkxMax);

  }
  public drawBorder(city){
    let parsedCity = JSON.parse(city);
    if (!parsedCity.geometry){
      return;
    }
    if (this.checkBounds(parsedCity.bounds)){
      let projectedCity = this.ProjectBorder(parsedCity);
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      this.ctx.beginPath()
      projectedCity.forEach((polygon) => {
        this.ctx.moveTo(polygon[0].x,polygon[0].y);
        polygon.forEach((point)=> {
          this.ctx.lineTo(point.x,point.y)
        })
      })
      this.ctx.filter = 'blur(5px)';
      this.ctx.fill();
    }
  }

}
export default boundaryLayer;
