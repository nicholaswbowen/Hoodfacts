import * as oboe from 'oboe';
declare var canvas;
declare var google;
export class BoundaryLayer{
  private overlayProjection;
  private canvas;
  private ctx;
  private centerPoint;
  private cityCoords;
  public boundaryType:string;
  public lastViewBounds:any;
  public viewBounds:any;
  constructor(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint,boundaryType){
    this.cityCoords = new Map();
    this.boundaryType = boundaryType;
    this.drawOverlay(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint);
  }
  private colorPicker(city,min,max){
    let random = () => Math.floor(Math.random() * 255);
    return `rgba(${random()}, ${random()}, ${random()}, 0.4)`
    // if (city.data === 'no data'){
    //   return `rgba(0, 0, 0, 0.2)`;
    // }else{
    //   return `rgba(${255 - 50*city.data}, 255, 0, 0.4)`;
    // }

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
  public createQuery() {
    let boundsQuery = `&xMax=${this.viewBounds.xMax}&yMax=${this.viewBounds.yMax}&xMin=${this.viewBounds.xMin}&yMin=${this.viewBounds.yMin}`
    let url;
    if (this.lastViewBounds){
      let excludeQuery = `&exMax=${this.lastViewBounds.xMax}&eyMax=${this.lastViewBounds.yMax}&exMin=${this.lastViewBounds.xMin}&eyMin=${this.lastViewBounds.yMin}`
      return `/api/boundary/?searchBy=${this.boundaryType}&exclude=true${boundsQuery}${excludeQuery}`
    }else{
      return `/api/boundary/?searchBy=${this.boundaryType}&exclude=false${boundsQuery}`
    }
  }
  public getBoundaries(){
    let url = this.createQuery() ;
    let resolveStreams:any = () => {
      return () => {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.cityCoords.forEach((city) => {
          this.drawBorder(city,this.colorPicker(city,0,5));
        })
      }
    }
    let resolveHeatMap:any = () => {
      resolveStreams = resolveStreams();
    }
    oboe({url})
      .node('{bounds}',(city) => {
        this.cityCoords.set(city.name,city);
        this.projectBorder(city)
          .then((result) => {
            city.canvasPaths = result;
            this.cityCoords.set(city.name,city);
            this.drawBorder(city,`rgba(153, 255, 153, 0.4)`);
          })
        return oboe.drop;
      })
      .node('{data}', (cityData) => {
        let city = this.cityCoords.get(cityData.name);
        this.cityCoords.set(city.name, Object.assign(city,cityData));
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
