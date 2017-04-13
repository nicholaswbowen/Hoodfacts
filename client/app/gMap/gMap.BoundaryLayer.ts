import * as oboe from 'oboe';
declare var canvas;
declare var google;
class boundaryLayer{
  public overlayProjection;
  public canvas;
  public ctx;
  public lastViewBounds:any = {};
  public viewBounds:any = {};
  constructor(overlayProjection,canvas,viewBounds,lastViewBounds){
    let self = this;
    this.lastViewBounds = lastViewBounds;
    this.viewBounds = viewBounds;
    this.overlayProjection = overlayProjection;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.getBoundaries();
    return this.viewBounds;
  }
  public ProjectBorder(city){
    let projectedBorders = [];
    city.geometry.coordinates.forEach((polygon) => {
      projectedBorders.push(
        polygon[0].map((point) => {
          let coords = new google.maps.LatLng(point[1], point[0]);
          return this.overlayProjection.fromLatLngToContainerPixel(coords);
      }));
    });
    return projectedBorders;
  }
  public getBoundaries(){
    let boundsQuery = `&xMax=${this.viewBounds.xMax}&yMax=${this.viewBounds.yMax}&xMin=${this.viewBounds.xMin}&yMin=${this.viewBounds.yMin}`
    let url;
    if (this.lastViewBounds){
      let excludeQuery = `&exMax=${this.lastViewBounds.xMax}&eyMax=${this.lastViewBounds.yMax}&exMin=${this.lastViewBounds.xMin}&eyMin=${this.lastViewBounds.yMin}`
      url = `/api/boundary/?searchBy=bounds&exclude=true${boundsQuery}${excludeQuery}`
    }else{
      url = `/api/boundary/?searchBy=bounds&exclude=false${boundsQuery}`
    }
    oboe({url})
      .on('node','{name}',(d) => {
      if (!sessionStorage.getItem(d.name)){
        this.drawBorder(JSON.stringify(d));
      }
      sessionStorage.setItem(d.name,JSON.stringify(d));
      return oboe.drop;
      })
    for (let i = 0; i < sessionStorage.length; i++){
      let fetchBorder = new Promise((resolve,reject) => {
        resolve(sessionStorage.getItem(sessionStorage.key(i)));
      })
      .then((result) => {
        this.drawBorder(result);
      })
    }
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
    // why am I projecting cities out side the viewbox?
    if (this.checkBounds(parsedCity.bounds)){
      let projectedCity = this.ProjectBorder(parsedCity);
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      this.ctx.beginPath();
      projectedCity.forEach((polygon) => {
        this.ctx.moveTo(polygon[0].x,polygon[0].y);
        polygon.forEach((point)=> {
          this.ctx.lineTo(point.x,point.y);
        })
      })
      this.ctx.fill();
    }
  }

}
export default boundaryLayer;
