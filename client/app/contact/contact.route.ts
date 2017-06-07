const route = function route($stateProvider) {
  $stateProvider
    .state('contact', {
      parent: 'main',
      url: '/contact',
      template: '<contact></contact>'
    });
};

route.$inject = ['$stateProvider'];

export default route;
