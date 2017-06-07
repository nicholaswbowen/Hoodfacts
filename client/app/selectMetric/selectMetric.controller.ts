
class SelectMetricController {
  public currentUser;
  public dataTypes;
    constructor(private $rootScope, private $http, private $scope) {
      this.getTags();
      this.$rootScope.$on('fetchNewtags', (reset) => {
        this.getTags();
        this.$scope.$digest();
      })
    }
  private submitData(tagName){
    if (this.$rootScope.mapZoomLevel == 'states'){
      this.$rootScope.currentStateMetric = tagName;
    }else if(this.$rootScope.mapZoomLevel == 'city'){
      this.$rootScope.currentCityMetric = tagName;
    }
    this.$rootScope.$emit('redrawMap');
  }
  private getTags(){
    this.$http.get(`/api/tags/?tagType=${this.$rootScope.mapZoomLevel}`)
      .then((result)=> {
        this.dataTypes = result.data;
      })
  }
 }
SelectMetricController.$inject = ['$rootScope','$http','$scope'];

export default SelectMetricController;
