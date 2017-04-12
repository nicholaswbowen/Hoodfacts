import {UserServiceClass} from '../services/user.service';

export class AuthController {
  public user;
  public newUser;
  constructor(
    private UserService: UserServiceClass,
    private AUTHENTICATION_STATUS,
    private $state: ng.ui.IStateService,
    private toastr,
    private $sessionStorage,
    private $localStorage,
    private SessionService
  ) {

  }
  public register () {
    this.UserService.register(this.newUser)
      .then((response) => {
        this.newUser = {};
        this.toastr.success(`Please sign in ${this.newUser.username}`, `Fantastic.`);
        this.$state.go('auth', null, {reload: true, notify: true});

      })
      .catch((e) => {
        this.toastr.warning(`${e.message}`, `Nope, you're already registered son.`);
      });
  }
  public login() {
    this.UserService.login(this.user)
      .then((response) => {
        this.$sessionStorage.user = response.user;
        this.toastr.success(`Welcome, ${this.user.username}`, this.AUTHENTICATION_STATUS.success);
        this.$state.go('profile', {username: this.user.username}, {reload: true, notify: true});
      }).catch((e) => {
        this.toastr.error('Authentication failed.', 'Error:401');
      });
  }

  public logout() {
    this.UserService.logout()
      .then((response) => {
        delete this.$localStorage.token;
        this.SessionService.destroy();
        this.toastr.info(`${this.user.username} has logged out.`, 'Goodbye');
        this.$state.go('home');
      })
      .catch((e) => {
        this.toastr.error('Unable to logout.', 'Error');
      });
  }
}
AuthController.$inject = ['UserService', 'AUTHENTICATION_STATUS', '$state', 'toastr', '$sessionStorage'];

export default AuthController;
