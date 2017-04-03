const route = function route($stateProvider) {
  $stateProvider
    .state('profile', {
      parent: 'main',
      url: '/profile/:username',
      template: '<profile></profile>',
      resolve: {
        currentSession: ['SessionService', (SessionService) => SessionService.getUser()]
      }
    });
};

route.$inject = ['$stateProvider'];

export default route;
