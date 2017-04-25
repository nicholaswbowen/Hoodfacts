import {UserServiceClass} from '../services/user.service';

export class AuthController {
  public user;
  public newUser;
  public $close;
  public userPattern;
  public userName;
  constructor(
    private UserService: UserServiceClass,
    private AUTHENTICATION_STATUS,
    private $state: ng.ui.IStateService,
    private toastr,
    private $sessionStorage,
    private $localStorage,
    private SessionService,
    private $uibModalStack,
    private PATTERN
  ) {
    this.userPattern = PATTERN.user;

  }

  public closeModal() {
    this.$uibModalStack.dismissAll(true);
  }

  public register () {
    if (this.newUser.password === this.newUser.confirmPassword) {
      this.UserService.register(this.newUser)
        .then((response) => {
          this.newUser = {};
          this.toastr.success(`Please sign in ${this.newUser.username}`, `Fantastic.`)
          // this.goToTheOtherTab.now()
        })
        .catch((e) => {
          this.toastr.warning(`${e.message}`, `Nope, you're already registered son. Go login.`);
        });
    } else {
      this.toastr.error('Submission Failed', 'Your password fields must match.');
    }
  }
  public login() {
    this.UserService.login(this.user)
      .then((response) => {

        this.UserService.getCurrentUser()
          .then ((user)=>{
            this.closeModal();
            this.$sessionStorage.user = user;
            this.toastr.success(`Welcome, ${user.username}`, this.AUTHENTICATION_STATUS.success);
            this.$state.go('home', {username: user.username}, {reload: true, notify: true});
        }).catch((e)=>{
          this.$sessionStorage.error('401 unauthorized');
        })

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
AuthController.$inject = [
  'UserService',
  'AUTHENTICATION_STATUS',
  '$state',
  'toastr',
  '$sessionStorage',
  '$localStorage',
  'SessionService',
  '$uibModalStack',
  'PATTERN'
];

export default AuthController;
