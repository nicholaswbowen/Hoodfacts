declare var google;
import * as GoogleMapsLoader from 'google-maps';
import {MAP_TERRAIN_STYLE} from './gMap.terrain.styles';
import BoundaryLayer from './gMap.BoundaryLayer';
class gMapController{
  public map;
  public boundaryOverlay;
  public count = 0;
  public $onInit;
  constructor(private $http){
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
      self.map.addListener('dragend', () => {
        window.setTimeout(()=>{
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
         let mapsize = {height: window.innerHeight, width: window.innerWidth}
         let projection = this.getProjection();
         let centerPoint = projection.fromLatLngToDivPixel(this.map.getCenter());
         var bounds = self.map.getBounds();
         this.canvas_.style.left = (centerPoint.x - mapsize.width  / 2) + "px";
         this.canvas_.style.top  = (centerPoint.y - mapsize.height / 2) + "px";
         this.canvas_.setAttribute('width', mapsize.width);
         this.canvas_.setAttribute('height', mapsize.height);
         if (panes.overlayLayer.firstChild){
           panes.overlayLayer.removeChild(panes.overlayLayer.firstChild);
         }
         panes.overlayLayer.appendChild(this.canvas_);
         new BoundaryLayer(projection,this.canvas_,self.$http,bounds.getNorthEast(),bounds.getSouthWest());
       };
       self.boundaryOverlay = new boundaryOverlay(self.map);
     });
  }
}

gMapController.$inject = ['$http'];
export default gMapController;
