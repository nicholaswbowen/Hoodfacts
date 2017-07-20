import * as oboe from 'oboe';
import {scaleLinear} from 'd3-scale';
declare var canvas;
declare var google;
export class BoundaryLayer{
  private $rootScope;
  private metric;
  private overlayProjection;
  private canvas;
  private ctx;
  private centerPoint;
  private placeCoords;
  private colorScale;
  public dataMax;
  public dataMin;
  public boundaryType:string;
  public lastViewBounds:any;
  public viewBounds:any;
  constructor(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint,boundaryType,metric,$rootScope){
    this.metric = metric;
    this.$rootScope = $rootScope;
    this.placeCoords = new Map();
    this.boundaryType = boundaryType;
    this.drawOverlay(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint,metric);
  }
  private colorPicker(place){
    if (place.data){
      return this.colorScale(place.data);
    }else{
      return `rgb(0, 0, 0)`;
    }
  }
  private generateColorRange(){
    let scale = scaleLinear()
      .domain([this.dataMin,this.dataMax])
      .range(['yellow','red']);
    this.colorScale = scale;
  }

  public drawOverlay(overlayProjection,canvas,viewBounds,lastViewBounds,centerPoint,metric){
    if (this.placeCoords.size > 3000){
      this.placeCoords = new Map();
      this.$rootScope.$emit('redrawMap');
    }else{
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
    if (this.lastViewBounds){
      let excludeQuery = `&exMax=${this.lastViewBounds.xMax}&eyMax=${this.lastViewBounds.yMax}&exMin=${this.lastViewBounds.xMin}&eyMin=${this.lastViewBounds.yMin}`
      return `/api/boundary/?searchBy=${this.boundaryType}&exclude=true${boundsQuery}${excludeQuery}`
    }else{
      return `/api/boundary/?searchBy=${this.boundaryType}&exclude=false${boundsQuery}`
    }
  }

  public checkMinMax(){
    let values = [];
    this.placeCoords.forEach((place) => {
      if (place.data && this.checkBounds(place.bounds)){
        if (place.data && place.data !== 'undefined'){
          values.push(place.data);
        }
      }
    })
    this.dataMax = Math.max(...values)
    this.dataMin = Math.min(...values)
    this.$rootScope.$emit('createLegend', {min:this.dataMin,max:this.dataMax});
    this.generateColorRange();
    console.log(this.placeCoords.get('California'))
  }

  public getBoundaries(){
    let url = this.createQuery() ;
    let resolveStreams:any = () => {
      return () => {
        this.checkMinMax()
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
          // this.ctx.fillText();
          this.ctx.fillStyle = color;
          this.ctx.fill(polygon);
        })
    }
  }
}
