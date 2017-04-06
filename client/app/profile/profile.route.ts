const route = function route($stateProvider) {
  $stateProvider
    .state('profile', {
      parent: 'main',
      url: '/profile/:username',
      template: '<profile></profile>'
    });
};

route.$inject = ['$stateProvider'];

export default route;
