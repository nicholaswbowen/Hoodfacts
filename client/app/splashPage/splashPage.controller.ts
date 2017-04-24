import * as angular from 'angular';

class SplashPageController implements ng.IController {
  public user;
  public $onInit;
  constructor(
    private SessionService,
    private UserService,
    private $state: ng.ui.IStateService,
    private toastr,
    private $localStorage,
    private $uibModal
  ) {
    console.log ('You are on the Splash Page')
    this.$onInit = function() {
      this.user = SessionService.getUser();
    };
  }

public openAuth() {
  this.$uibModal.open({
    component: 'auth',
    size: 'lg'
  });
};
}
SplashPageController.$inject = [
  'SessionService',
  'UserService',
  '$state',
  'toastr',
  '$localStorage',
  '$uibModal'
];

export default SplashPageController;
