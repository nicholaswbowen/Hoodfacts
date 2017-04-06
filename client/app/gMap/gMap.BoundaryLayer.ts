
declare var canvas;
declare var google;
class boundaryLayer{
  public test = 'sup';
  public overlayProjection;
  public boundaryOverlay;
  public canvas;
  public ctx;
  public $http;
  public cities = [];
  constructor(overlayProjection,canvas,$http){
    let self = this;
    this.overlayProjection = overlayProjection;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.$http = $http;
    this.getBoundaries()
      .then((result) => {
        let keys = Object.keys(result.data);
        keys.forEach((key) => {
          this.cities.push(JSON.parse(result.data[key]));
        })
        this.drawOverlay();
      })

  }
  public drawOverlay(){
    this.cities.forEach((city) => this.drawBorder(city))
  }
  public ProjectBorder(city){
    let projectedBorder = [];
    city.geometry.coordinates.forEach((polygon) => {
      projectedBorder.push(
        polygon[0].map((point) => {
          let coords = new google.maps.LatLng(point[1], point[0])
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
    return this.$http.get('/api/boundary');
  }
  public drawBorder(city){
    let projectedCity = this.ProjectBorder(city);
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    this.ctx.beginPath()
    projectedCity.forEach((polygon) => {
      this.ctx.moveTo(polygon[0].x,polygon[0].y);
      polygon.forEach((point)=> {
        this.ctx.lineTo(point.x,point.y)
      })
    })
    this.ctx.filter = 'blur(10px)';
    this.ctx.fill();
  }
}
export default boundaryLayer;
