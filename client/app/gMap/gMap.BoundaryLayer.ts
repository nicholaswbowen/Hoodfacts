import * as oboe from 'oboe';
import {scaleLinear} from 'd3-scale';
import {color} from 'd3-color';
import {opacity} from 'd3-color';
declare var canvas;
declare var google;
export class BoundaryLayer{
  private metric;
  private dataMax;
  private dataMin;
  private overlayProjection;
  private canvas;
  private ctx;
  private centerPoint;
  private placeCoords;
  public boundaryType:string;
  public lastViewBounds:any;
  public viewBounds:any;
  constructor(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint,boundaryType,metric){
    this.metric = metric;
    this.dataMax = 0;
    this.dataMin = 100000000;
    this.placeCoords = new Map();
    this.boundaryType = boundaryType;
    this.drawOverlay(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint,metric);
  }
  private colorPicker(place){
    // let random = () => Math.floor(Math.random() * 255);
    // return `rgba(${random()}, ${random()}, ${random()}, 0.4)`
    if (place.data){
      return this.colorRange(place.data);
    }else{
      return `rgb(0, 0, 0)`;
    }
  }
  private colorRange(data){
    let scale = scaleLinear()
      .domain([this.dataMin,this.dataMax])
      .range(['yellow','red']);
    return scale(data);
  }
  public drawOverlay(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint,metric){
    this.overlayProjection = overlayProjection;
    this.canvas = canvas;
    this.viewBounds = viewBounds;
    this.lastViewBounds = lastViewBounds;
    this.centerPoint = centerPoint;
    this.metric = metric;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.globalAlpha = 0.4;
    this.getBoundaries();
  }

  public projectBorder(place){
    return new Promise((resolve,reject) => {
        let projectedBorders = [];
        let pathObjects = [];
        place.geometry.coordinates.forEach((polygon) => {
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
    let boundsQuery = `&xMax=${this.viewBounds.xMax}&yMax=${this.viewBounds.yMax}&xMin=${this.viewBounds.xMin}&yMin=${this.viewBounds.yMin}&dataTarget=${this.metric}`
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
        this.placeCoords.forEach((place) => {
          this.drawBorder(place,this.colorPicker(place));
        })
      }
    }
    let resolveHeatMap:any = () => {
      resolveStreams = resolveStreams();
    }
    oboe({url})
      .node('{bounds}',(place) => {
        this.placeCoords.set(place.name,place);
        this.projectBorder(place)
          .then((result) => {
            place.canvasPaths = result;
            this.placeCoords.set(place.name,place);
            this.drawBorder(place,`rgb(153, 255, 153)`);
          })
        return oboe.drop;
      })
      .node('{data}', (placeData) => {
        if (placeData.data >= this.dataMax){
          this.dataMax = placeData.data;
        }
        if (placeData.data <= this.dataMin){
          this.dataMin = placeData.data;
        }
        let place = this.placeCoords.get(placeData.name);
        this.placeCoords.set(place.name, Object.assign(place,placeData));
      })
      .on('end', () => {
        resolveHeatMap();
      })

      if(this.placeCoords){
        this.placeCoords.forEach((place) => {
          this.projectBorder(place)
            .then((result) => {
              place.canvasPaths = result;
              this.placeCoords.set(place.name,place);
              this.drawBorder(place,`rgb(153, 255, 153)`);
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
  public drawBorder(place, color){
    if (this.checkBounds(place.bounds)){
        place.canvasPaths.forEach((polygon) => {
          this.ctx.fillStyle = color;
          this.ctx.fill(polygon);
        })
    }
  }
}
