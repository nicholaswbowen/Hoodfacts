import {ProfileServiceClass} from '../services/profile.service';
class ProfileController {
  public currentUser;
  public profileID;
  public profile;
  public date = new Date();
  constructor(
    private ProfileService: ProfileServiceClass,
    private $state: ng.ui.IStateService,
    private toastr,
    SessionService,
    $stateParams,
    private $uibModal,
    private $uibModalStack
  ) {
    if (!$stateParams['username'] || $stateParams['username'] === '') {
      this.profileID = SessionService.getUser().username;
    } else {
      this.profileID = $stateParams['username'];
    }
    this.getProfile();
  }
  public closeModal() {
    this.$uibModal.dismissAll(true);
  }


  public getProfile() {
    // api call to profiles
    this.ProfileService.getProfile(this.profileID).then((res) => {
        this.profile = res;
      }).catch((err) => {
        this.toastr.error('Profile loading failed.', 'Error:401');
      });
  }
};

ProfileController.$inject = [
  'ProfileService',
  '$state',
  'toastr',
  'SessionService',
  '$stateParams',
  '$uibModalStack'
];

export default ProfileController;
