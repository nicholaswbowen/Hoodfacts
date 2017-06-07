import * as angular from 'angular';

class LayoutController implements ng.IController {
  public user;
  public $onInit;
  constructor(
    private SessionService,
    private UserService,
    private $state: ng.ui.IStateService,
    private toastr,
    private $localStorage
  ) {
    this.$onInit = function() {
      this.user = SessionService.getUser();
    };
  }
}

LayoutController.$inject = [
  'SessionService',
  'UserService',
  '$state',
  'toastr',
  '$localStorage'
];

export default LayoutController;
