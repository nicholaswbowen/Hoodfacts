import * as angular from 'angular';
export default [
  '$rootScope',
  'UserService',
  '$sessionStorage',
  'SessionService',
  '$state',
  'AUTH_EVENTS',
  'toastr',
  '$localStorage',
  '$timeout',
  function run(
    $rootScope,
    UserService,
    $sessionStorage,
    SessionService,
    $state,
    AUTH_EVENTS,
    toastr,
    $localStorage,
    $timeout
  ) {
    $rootScope.$on('$stateChangeStart', (event, next) => {
      UserService.getCurrentUser().then((user) => {
        $sessionStorage.user = user;
        !user['username'] ? $localStorage['token'] = {} : angular.noop();
      }).catch((user) => {
        $sessionStorage.user = user;
        !user['username'] ? $localStorage['token'] = {} : angular.noop();
      });

      if (next.data) {
        let authorizedRoles = next.data['authorizedRoles'] ? next.data['authorizedRoles'] : false;
        if (authorizedRoles && !SessionService.isAuthorized(authorizedRoles)) {
          event.preventDefault();
          toastr.warning('I can\'t let you do that.', `I'm sorry Michael`);
          $timeout(() => {
            $state.go('auth');
          }, 1500);
        }
      }
    });
  }
];
