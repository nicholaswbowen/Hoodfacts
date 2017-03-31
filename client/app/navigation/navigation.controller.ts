import {SessionServiceClass} from '../services/session.service';
class NavigationController {
  public isAuthenticated;
  public currentUser;
  constructor(
      private $state: ng.ui.IStateService,
      $stateParams: ng.ui.IStateParamsService,
      private SessionService: SessionServiceClass,
      private UserService,
      private $sessionStorage
  ) {
    this.isAuth();
  }
  public isAuthorized(roles: string) {
    return this.SessionService.isAuthorized(roles);
  }
  public goToState(state: string) {
    this.$state.go(state);
  }
  public logout() {
   this.UserService.logout().then(() => {
     this.SessionService.destroy();
     this.$state.go('home', null, {reload: true, notify: true});
   }).catch(() => {
     throw new Error('Unsuccessful logout');
   });
 }

 public isAuth () {
   this.UserService.getCurrentUser().then((user) => {
     this.$sessionStorage.user = user;
     this.isAuthenticated = user.hasOwnProperty('username');
     this.currentUser = this.SessionService.getUser();
   }).catch((user) => {
     this.$sessionStorage.user = user;
     this.isAuthenticated = user.hasOwnProperty('username');
     this.currentUser = this.SessionService.getUser();
   });
 }
}

NavigationController.$inject = [
  '$state',
  '$stateParams',
  'SessionService',
  'UserService',
  '$sessionStorage'
];

export default NavigationController;
