import * as angular from 'angular';

class SplashPageController implements ng.IController {
  public user;
  public $onInit;
  constructor(
    private SessionService,
    private UserService,
    private $state: ng.ui.IStateService,
    private toastr,
    private $localStorage
  ) {
    console.log ('You are on the Splash Page')
    this.$onInit = function() {
      this.user = SessionService.getUser();
    };
  }
}

SplashPageController.$inject = [
  'SessionService',
  'UserService',
  '$state',
  'toastr',
  '$localStorage'
];

export default SplashPageController;
