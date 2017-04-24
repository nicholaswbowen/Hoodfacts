
class SelectMetricController {
  public currentUser;
  public dataTypes;
    constructor(private $rootScope, private $http) {
      this.getTags();
    }
  private submitData(tagName){
    this.$rootScope.currentMetric = tagName;
    this.$rootScope.$emit('redrawMap');
  }
  private getTags(){
    this.$http.get(`/api/tags/?tagType=${this.$rootScope.mapZoomLevel}`)
      .then((result)=> {
        console.log(result);
        this.dataTypes = result.data;
      })
  }
 }
SelectMetricController.$inject = ['$rootScope','$http'];

export default SelectMetricController;
