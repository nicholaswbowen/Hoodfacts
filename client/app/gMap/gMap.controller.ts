declare var google;
import * as GoogleMapsLoader from 'google-maps';
import * as angular from 'angular';
class gMapController{
  public count = 0;
  public test = 'sup';
  public map;
  public overlay;
  public $onInit;
  constructor(private $scope, private $compile){
    this.$onInit = () => {
      this.bootStrapMap();
    }
    this.$scope.$on('renderOverlay', this.createOverlay());
  }
  public bootStrapMap(){
    let self = this;
    GoogleMapsLoader.KEY = 'AIzaSyCUVX_TYWU5VOBjTr5B4-lN_H0X9OgNimM';
    GoogleMapsLoader.load(function(google) {
       self.map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 47.673988, lng:-122.121513}, //lat: 47.673988, lng:-122.121513
         zoom: 13 //47.79264, -122.403055
       });
       boundaryOverlay.prototype = new google.maps.OverlayView();
       function boundaryOverlay(bounds,image,map){
         this.bounds_ = bounds;
         this.image_ = image;
         this.div_ = null;
         this.setMap(map);
       }

       boundaryOverlay.prototype.onAdd = function(){
         let div = document.createElement('div');
         div.setAttribute('id','myDiv');
         div.style.borderColor = '#00ff00';
         div.style.borderStyle = 'solid';
         div.style.borderWidth = '1px';
         div.style.background = 'none';
         div.style.position = 'absolute';
         this.div_ = div;
         let panes = this.getPanes();
         panes.overlayLayer.appendChild(div);
       }
       boundaryOverlay.prototype.draw = function() {
         console.log('draw')
         var overlayProjection = this.getProjection();
         var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
         var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
         var div = this.div_;
         div.style.left = sw.x + 'px';
         div.style.top = ne.y + 'px';
         div.style.width = (ne.x - sw.x) + 'px';
         div.style.height = (sw.y - ne.y) + 'px';
         self.createOverlay();
       };
       boundaryOverlay.prototype.onRemove = function() {
         this.div_.parentNode.removeChild(this.div_);
         this.div_ = null;
       };
       let bounds = new google.maps.LatLngBounds(
       new google.maps.LatLng(22, -135), //22 , -135 (47.192641, -122.821513)
       new google.maps.LatLng(50,  -66));
       let srcImage = 'https://developers.google.com/maps/documentation/' + 'javascript/examples/full/images/talkeetna.png';
       new boundaryOverlay(bounds, srcImage, self.map);
     });
  }
  createOverlay(){
    let e = document.getElementById('myDiv');
    try{
      e.removeChild(e.firstChild);
    }
    catch(e){}
    let b = angular.element(document.createElement('boundaries'));
    let el = this.$compile(b)(this.$scope);
    angular.element(e).append(el);
    this.$scope.insertHere = el;
  }
}

gMapController.$inject = ['$scope', '$compile'];
export default gMapController;
