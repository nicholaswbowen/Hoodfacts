import {SessionServiceClass} from '../services/session.service';

class HomeController {
  public title: string;
  public user;
  public testShape;
  public map;
  constructor(
    HOME_CONFIG,
    private SessionService: SessionServiceClass,
    private NgMap,
    private $http
  ) {
    this.NgMap.getMap().then((m) => {
      this.map = m
      this.getBoundaries();
    });
    this.title = HOME_CONFIG.title;
    this.user = SessionService.getUser();

  }

  public getBoundaries(){
    this.$http.get('/api/boundary')
      .then((result) => {
        this.map.data.addGeoJson(JSON.parse(result.data.file))
        this.map.data.addGeoJson(JSON.parse(result.data.file2))
        this.map.data.addGeoJson(JSON.parse(result.data.file3))
          this.map.data.setStyle({
            fillColor: '#5B965B',
            fillOpacity: 0.2,
            strokeColor: '#6BA06B',
            strokeWeight: 0,
          })
        console.table(JSON.parse(result.data.file));
      })
  }

}

HomeController.$inject = [
  'HOME_CONFIG',
  'SessionService',
  'NgMap',
  '$http'
];

export default HomeController;
