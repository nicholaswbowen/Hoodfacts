const route = function route($stateProvider) {
  $stateProvider
    .state('usersIndex', {
      parent: 'main',
      url: '/users-index',
      template: '<users-index></users-index>'
    });
};

route.$inject = ['$stateProvider'];

export default route;
