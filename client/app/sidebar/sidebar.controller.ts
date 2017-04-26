import {SessionServiceClass} from '../services/session.service';
class SidebarController {
  public isAuthenticated;
  public currentUser;
    constructor(private $state: ng.ui.IStateService,
    $stateParams: ng.ui.IStateParamsService,
    private SessionService: SessionServiceClass,
    private UserService,
    private $sessionStorage,
    private $uibModal,
    private $rootScope
  ) {
        this.isAuth();
    }
    public openNav() {
       document.getElementById('mySidenav').style.width = 'inherit';
       document.getElementById('sidenavContainer').setAttribute('class', 'col-xs-12 col-md-3');
       document.getElementById('map').setAttribute('class', 'col-xs-0 col-md-9');
   }

    public closeNav() {
       document.getElementById('mySidenav').style.width = '0';
       document.getElementById('sidenavContainer').setAttribute('class', 'col-xs-0');
       document.getElementById('map').setAttribute('class', 'col-xs-12');
       window.setTimeout(() => {
         this.$rootScope.$emit('realignMap');
       }, 500);
   }
   public openProfile() {
     this.$uibModal.open({
       component: 'profile',
       size: 'lg'
     });
   };

   public openAuth() {
     this.$uibModal.open({
       component: 'auth',
       size: 'lg'
     });
   };

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
 SidebarController.$inject = [
   '$state',
   '$stateParams',
   'SessionService',
   'UserService',
   '$sessionStorage',
   '$uibModal',
   '$rootScope'
 ];

export default SidebarController;
