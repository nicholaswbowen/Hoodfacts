declare var google;
import * as GoogleMapsLoader from 'google-maps';
import {MAP_TERRAIN_STYLE} from './gMap.terrain.styles';
import BoundaryLayer from './gMap.BoundaryLayer';
class gMapController{
  public map;
  public boundaryOverlay;
  public count = 0;
  public $onInit;
  public lastBounds;
  public currentBounds;
  public mapsize;
  constructor(){
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
        zoom: 13,
        streetViewControl: false,
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
          self.boundaryOverlay.draw();
        },0)
      })
       boundaryOverlay.prototype = new google.maps.OverlayView();
       function boundaryOverlay(map){
         this.canvas_ = null;
         this.setMap(map);
       }
       boundaryOverlay.prototype.onAdd = function(){
         let canvas = document.createElement('canvas');
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
         self.currentBounds = self.setBounds(bounds.getNorthEast(),bounds.getSouthWest())
         self.lastBounds = new BoundaryLayer(projection,this.canvas_,self.currentBounds,self.lastBounds);
         self.lastBounds = self.currentBounds;
       };
       self.boundaryOverlay = new boundaryOverlay(self.map);
     });
  }
  public setBounds(ne,sw){
    let viewBounds:any = {};
    const OFFSET = 0.1;
    viewBounds.xMax = ne.lat()+OFFSET;
    viewBounds.yMax = ne.lng()+OFFSET;
    viewBounds.xMin = sw.lat()-OFFSET;
    viewBounds.yMin = sw.lng()-OFFSET;
    return viewBounds;
  }
}

gMapController.$inject = [];
export default gMapController;
