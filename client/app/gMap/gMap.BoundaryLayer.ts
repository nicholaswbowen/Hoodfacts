import * as oboe from 'oboe';
declare var canvas;
declare var google;
class boundaryLayer{
  public overlayProjection;
  public canvas;
  public ctx;
  public lastViewBounds:any = {};
  public viewBounds:any = {};
  private centerPoint;
  private cityCoords;
  constructor(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint){
    this.cityCoords = new Map();
    this.drawOverlay(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint);
  }
  private colorPicker(city){
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`;
  }
  public drawOverlay(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint){
    this.lastViewBounds = lastViewBounds;
    this.viewBounds = viewBounds;
    this.overlayProjection = overlayProjection;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.centerPoint = centerPoint;
    this.getBoundaries();
  }

  public projectBorder(city){
    return new Promise((resolve,reject) => {
        let projectedBorders = [];
        let pathObjects = []
        city.geometry.coordinates.forEach((polygon) => {
          projectedBorders.push(
            polygon[0].map((point) => {
              let coords = new google.maps.LatLng(point[1], point[0]);
              return this.overlayProjection.fromLatLngToContainerPixel(coords);
          }));
        });
        projectedBorders.forEach((polygon) => {
          let pathObject = new Path2D();
          pathObject.moveTo(polygon[0].x,polygon[0].y);
          polygon.forEach((point)=> {
            pathObject.lineTo(point.x,point.y);
          })
          pathObject.closePath();
          pathObjects.push(pathObject);
        })
        resolve(pathObjects);
    })

  }
  public getBoundaries(){
    let boundsQuery = `&xMax=${this.viewBounds.xMax}&yMax=${this.viewBounds.yMax}&xMin=${this.viewBounds.xMin}&yMin=${this.viewBounds.yMin}`
    let url;
    let resolveStreams:any = () => {
      return () => {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.cityCoords.forEach((city) => {
          this.drawBorder(city,this.colorPicker(city));
        })
      }
    }
    let resolveHeatMap:any = () => {
      resolveStreams = resolveStreams();
    }
    if (this.lastViewBounds){
      let excludeQuery = `&exMax=${this.lastViewBounds.xMax}&eyMax=${this.lastViewBounds.yMax}&exMin=${this.lastViewBounds.xMin}&eyMin=${this.lastViewBounds.yMin}`
      url = `/api/boundary/?searchBy=bounds&exclude=true${boundsQuery}${excludeQuery}&center=${this.centerPoint}`
    }else{
      url = `/api/boundary/?searchBy=bounds&exclude=false${boundsQuery}&center=${this.centerPoint}`
    }
    // when we Should not be fetching:
    // 1. When zooming in, we already have the data
    // 2. When moving within already fetched space. AKA, the "viewBox" is within the "fetchBox"
    // when we have to fetch:
    // 1. When we change the data set
    // 2. When we exceed the "fetchBox"

    oboe({url})
      .on('node','{name}',(city) => {
        this.cityCoords.set(city.name,city);
        this.projectBorder(city)
          .then((result) => {
            city.canvasPaths = result;
            this.cityCoords.set(city.name,city);
            this.drawBorder(city,`rgba(153, 255, 153, 0.4)`);
          })
        return oboe.drop;
      })
      .on('end', () => {
        resolveHeatMap();
      })

      if(this.cityCoords){
        this.cityCoords.forEach((city) => {
          this.projectBorder(city)
            .then((result) => {
              city.canvasPaths = result;
              this.cityCoords.set(city.name,city);
              this.drawBorder(city,`rgba(153, 255, 153, 0.4)`);
            })
        })
        resolveHeatMap();
      }
    }
  public checkBounds(bounds){
    let checkyMin = (bounds.yMin >= this.viewBounds.yMin && bounds.yMin <= this.viewBounds.yMax);
    let checkxMin = (bounds.xMin >= this.viewBounds.xMin && bounds.xMin <= this.viewBounds.xMax);
    let checkyMax = (bounds.yMax >= this.viewBounds.yMin && bounds.yMax <= this.viewBounds.yMax);
    let checkxMax = (bounds.xMax >= this.viewBounds.xMin && bounds.xMax <= this.viewBounds.xMax);
    return (checkyMin && checkxMin || checkyMax && checkxMax);

  }
  public drawBorder(city, color){
    if (this.checkBounds(city.bounds)){
        city.canvasPaths.forEach((polygon) => {
          this.ctx.fillStyle = color;
          this.ctx.fill(polygon);
        })
    }
  }

}
export default boundaryLayer;
