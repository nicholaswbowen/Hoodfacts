declare var google;
import * as GoogleMapsLoader from 'google-maps';
import {MAP_TERRAIN_STYLE} from './gMap.terrain.styles';
import {BoundaryLayer} from './gMap.BoundaryLayer';
class gMapController implements ng.IController{
  private lastZoom;
  private map;
  private boundaryOverlay;
  private canvasLayer;
  public $onInit;
  private lastBounds;
  private currentBounds;
  private mapsize;
  private metricSelection;
  private currentBoundaryType:string;
  constructor(private $rootScope, private $sessionStorage){
    this.mapsize = {height: document.getElementById('map').clientHeight, width: document.getElementById('map').clientWidth}
    this.$onInit = () => {
      this.bootStrapMap();
    }
  }
  private bootStrapMap(){
    let self = this;
    GoogleMapsLoader.KEY = 'AIzaSyCUVX_TYWU5VOBjTr5B4-lN_H0X9OgNimM';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
    GoogleMapsLoader.load(function(google) {
      self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8333333, lng:-98.585522},
        maxZoom: 11,
        minZoom: 5,
        zoom: 5,
        disableDefaultUI: true,
        zoomControl: true,
        styles: MAP_TERRAIN_STYLE
      });
    self.lastZoom = self.map.zoom;
    // This listener redraws the overlay when the user scrolls around.
    self.map.addListener('center_changed', () => {
        self.boundaryOverlay.draw();
    })
    // This listener checks your zoom listener to make the user avoid the sweet-spot where the map loads way too many borders.
    self.map.addListener('zoom_changed', () => {
        if (self.map.zoom < 11 && self.map.zoom > 7){
          if (self.map.zoom < self.lastZoom){
            self.map.setZoom(7);
          }else{
            self.map.setZoom(11);
          }
        }
      self.lastZoom = self.map.zoom;
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
       console.log(self.map)
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
       //if wer are at a state zoomlevel, add an offset.
       let offset;
       if (self.currentBoundaryType == 'states'){
         offset = 2.5;
       }else{
         offset = 0;
       }
       self.currentBounds = self.setBounds(bounds.getNorthEast(),bounds.getSouthWest(),offset);
       // initialize a new layer if there isn't one, if there is , call drawOverlay.
       if (!self.canvasLayer){
         self.canvasLayer = new BoundaryLayer(projection,this.canvas_,self.currentBounds,self.lastBounds,this.map.getCenter(),newBoundaryType,self.metricSelection,self.$rootScope);
       }else{
         self.canvasLayer.drawOverlay(projection,this.canvas_,self.currentBounds,self.lastBounds,this.map.getCenter(),self.metricSelection);
       }

       self.lastBounds = self.currentBounds;
       self.currentBoundaryType = newBoundaryType;
     };
     self.addSearchBox();
     self.boundaryOverlay = new boundaryOverlay(self.map);

     });
  }

  private addSearchBox(){
    let map = this.map;
    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      let places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      let bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        console.log(map)
        let icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

  }


  private checkMapZoom(){
    let checkChanged = this.$rootScope.mapZoomLevel;
    let result;
    if (this.map.zoom <= 8){
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
  private setBounds(ne,sw,OFFSET){
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
