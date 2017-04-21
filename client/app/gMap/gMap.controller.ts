declare var google;
import * as GoogleMapsLoader from 'google-maps';
import {MAP_TERRAIN_STYLE} from './gMap.terrain.styles';
import {BLANK_MAP} from './gMap.blank.styles';
import {BoundaryLayer} from './gMap.BoundaryLayer';
class gMapController{
  public map;
  public boundaryOverlay;
  public canvasLayer;
  public $onInit;
  public lastBounds;
  public currentBounds;
  public mapsize;
  public currentBoundaryType:string;
  constructor(private $rootScope){
    this.mapsize = {height: document.getElementById('map').clientHeight, width: document.getElementById('map').clientWidth}
    this.$onInit = () => {
      this.bootStrapMap();
    }
  }
  public bootStrapMap(){
    let self = this;

    GoogleMapsLoader.KEY = 'AIzaSyCUVX_TYWU5VOBjTr5B4-lN_H0X9OgNimM';
    GoogleMapsLoader.load(function(google) {
      self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.673988, lng:-122.121513},
        maxZoom: 13,
        minZoom: 3,
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        styles: MAP_TERRAIN_STYLE
      });
      self.map.addListener('center_changed', () => {
        window.setTimeout(()=>{
          self.boundaryOverlay.draw();
        },0)
      })
      google.maps.event.addListener(self.map,'bounds_changed', () => {
        window.setTimeout(()=>{
          google.maps.event.trigger(self.map, 'resize');
        },0)
      })
       boundaryOverlay.prototype = new google.maps.OverlayView();
       function boundaryOverlay(map){
         this.canvas_ = null;
         this.setMap(map);
       }
       boundaryOverlay.prototype.onAdd = function(){
         let canvas = document.createElement('canvas');
         self.currentBoundaryType = self.checkMapZoom();
         canvas.setAttribute('id','boundaryOverlay');
         this.canvas_ = canvas;
       }
       boundaryOverlay.prototype.onRemove = function() {
         this.canvas_.parentNode.removeChild(this.canvas_);
         this.canvas_ = null;
       };
       boundaryOverlay.prototype.draw = function() {
         let panes = this.getPanes();
         let projection = this.getProjection();
         let centerPoint = projection.fromLatLngToDivPixel(this.map.getCenter());
         var bounds = self.map.getBounds();
         self.mapsize =
         {height: document.getElementById('map').offsetHeight,
          width: (document.getElementById('map').offsetWidth)}
         this.canvas_.style.left = (centerPoint.x - self.mapsize.width  / 2) + "px";
         this.canvas_.style.top  = (centerPoint.y - self.mapsize.height / 2) + "px";
         this.canvas_.setAttribute('width', self.mapsize.width);
         this.canvas_.setAttribute('height', self.mapsize.height);


         if (panes.overlayLayer.firstChild){
           panes.overlayLayer.removeChild(panes.overlayLayer.firstChild);
         }
         panes.overlayLayer.appendChild(this.canvas_);


         let newBoundaryType = self.checkMapZoom();
         console.log(self.currentBoundaryType);
         console.log(newBoundaryType);
         if (self.currentBoundaryType !== newBoundaryType){
           console.log('switched')
           self.canvasLayer = undefined;
           self.lastBounds = undefined;
         }
         let offset;
         if (self.currentBoundaryType == 'cities'){
           offset = .1
         }else if (self.currentBoundaryType == 'states'){
           offset = 5;
         }
         self.currentBounds = self.setBounds(bounds.getNorthEast(),bounds.getSouthWest(),offset)
         if (!self.canvasLayer){
           self.canvasLayer = new BoundaryLayer(projection,this.canvas_,self.currentBounds,self.lastBounds,this.map.getCenter(),newBoundaryType);
         }else{
           self.canvasLayer.drawOverlay(projection,this.canvas_,self.currentBounds,self.lastBounds,this.map.getCenter());
         }
         self.lastBounds = self.currentBounds;
         self.currentBoundaryType = newBoundaryType;
       };

       self.boundaryOverlay = new boundaryOverlay(self.map);

     });
  }
  public checkMapZoom(){
    if (this.map.zoom <= 8){
      this.$rootScope.mapZoomLevel = "states";
      return "states";
    }else{
      this.$rootScope.mapZoomLevel = "cities";
      return "cities";
    }
 }
  public setBounds(ne,sw,OFFSET){
    let viewBounds:any = {};
    viewBounds.xMax = ne.lat()+OFFSET;
    viewBounds.yMax = ne.lng()+OFFSET;
    viewBounds.xMin = sw.lat()-OFFSET;
    viewBounds.yMin = sw.lng()-OFFSET;
    return viewBounds;
  }
}

gMapController.$inject = ['$rootScope'];
export default gMapController;
