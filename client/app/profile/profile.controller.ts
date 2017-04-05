import {ProfileServiceClass} from '../services/profile.service';
class ProfileController {
  public currentUser;
  public profileID;
  public profile;
  public alerts = [];

  constructor(
    private ProfileService: ProfileServiceClass,
    private $state: ng.ui.IStateService,
    SessionService,
    $stateParams
  ) {
    if (!$stateParams['username'] || $stateParams['username'] === '') {
      this.profileID = SessionService.getUser().username;
    } else {
      this.profileID = $stateParams['username'];
    }
    this.getProfile();
  }

  public getProfile() {
    // api call to profiles
    this.ProfileService.getProfile(this.profileID).then((res) => {
        this.profile = res;
      }).catch((err) => {
        this.alerts.push({type: 'warning', message: 'Oh no! We can not find your profile! Please login again'});
      });
  }
};

ProfileController.$inject = [
  'ProfileService',
  '$state',
  'SessionService',
  '$stateParams'
];

export default ProfileController;
