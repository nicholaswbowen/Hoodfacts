
class SelectMetricController {
  public currentUser;
  public groups;
    constructor(private $rootScope, private $http) {
      this.groups = [
        {
          title: 'Education',
          tags: ["High School", "Bachelors", "Masters and Above"]
        },
        {
          title: 'Crime',
          tags: ["Homocides", "Robberies"]
        }
      ];
    }
  private submitData(tagName){
    this.$rootScope.activeTag = tagName;
  }
  private getTags(){
    let query;
    this.$http.get(`/api/tags/?tagtype=${this.$rootScope.mapZoomLevel}`)
      .then((result)=> {
        console.log(result);
      })
  }
 }
SelectMetricController.$inject = ['$rootScope','$http'];

export default SelectMetricController;
