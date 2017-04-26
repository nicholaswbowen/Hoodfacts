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
  private metricSelection;
  public currentBoundaryType:string;
  constructor(private $rootScope, private $sessionStorage){
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
        center: {lat: 39.8333333, lng:-98.585522},
        maxZoom: 13,
        minZoom: 3,
        zoom: 5,
        disableDefaultUI: true,
        zoomControl: true,
        styles: MAP_TERRAIN_STYLE
      });
      // This listener redraws the overlay when the user scrolls around.
      self.map.addListener('center_changed', () => {
          self.boundaryOverlay.draw();
      })
      //This listener makes sure the map size stays consistent when the window gets resized.
      google.maps.event.addListener(self.map,'bounds_changed', () => {
          google.maps.event.trigger(self.map, 'resize');
      })
      //This listener is used to trigger a redraw from outside the map, somewhere else in the app.
      self.$rootScope.$on('redrawMap', (reset) => {
          self.resetCanvas();
          google.maps.event.trigger(self.map, 'resize');
          self.boundaryOverlay.draw();
      })
      self.$rootScope.$on('realignMap', (reset) => {
          google.maps.event.trigger(self.map, 'resize');
          self.boundaryOverlay.draw();
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
         self.mapsize = {height: document.getElementById('map').offsetHeight, width: (document.getElementById('map').offsetWidth)};
         this.canvas_.style.left = (centerPoint.x - self.mapsize.width  / 2) + 'px';
         this.canvas_.style.top  = (centerPoint.y - self.mapsize.height / 2) + 'px';
         this.canvas_.setAttribute('width', self.mapsize.width);
         this.canvas_.setAttribute('height', self.mapsize.height);
         //
         if (panes.overlayLayer.firstChild){
           panes.overlayLayer.removeChild(panes.overlayLayer.firstChild);
         }
         panes.overlayLayer.appendChild(this.canvas_);


         let newBoundaryType = self.checkMapZoom();
         if (self.currentBoundaryType !== newBoundaryType){
           self.resetCanvas();
         }
         let offset;
         if (self.currentBoundaryType == 'cities'){
           offset = .1;
         }else if (self.currentBoundaryType == 'states'){
           offset = 5;
         }
         self.currentBounds = self.setBounds(bounds.getNorthEast(),bounds.getSouthWest(),offset);
         if (!self.canvasLayer){
           self.canvasLayer = new BoundaryLayer(projection,this.canvas_,self.currentBounds,self.lastBounds,this.map.getCenter(),newBoundaryType,self.metricSelection,self.$rootScope);
         }else{
           self.canvasLayer.drawOverlay(projection,this.canvas_,self.currentBounds,self.lastBounds,this.map.getCenter(),self.metricSelection);
         }

         self.lastBounds = self.currentBounds;
         self.currentBoundaryType = newBoundaryType;
       };

       self.boundaryOverlay = new boundaryOverlay(self.map);

     });
  }
  public checkMapZoom(){
    let checkChanged = this.$rootScope.mapZoomLevel;
    let result;
    if (this.map.zoom <= 8){
      //'fetchNewtags'
      this.metricSelection = this.$rootScope.currentStateMetric;
      this.$rootScope.mapZoomLevel = 'states';
      result = 'states';
    }else{
      this.metricSelection = this.$rootScope.currentCityMetric;
      this.$rootScope.mapZoomLevel = 'cities';
      result = 'cities';
    }
    if (checkChanged !== this.$rootScope.mapZoomLevel){
        this.$rootScope.$emit('fetchNewtags');
    }
    return result;
 }
  private resetCanvas(){
    this.canvasLayer = undefined;
    this.lastBounds = undefined;
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

gMapController.$inject = ['$rootScope', '$sessionStorage'];
export default gMapController;
