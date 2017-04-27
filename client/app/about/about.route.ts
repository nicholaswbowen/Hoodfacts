const route = function route($stateProvider) {
  $stateProvider
    .state('about', {
      parent: 'main',
      url: '/about',
      template: '<about></about>'
    });
};

route.$inject = ['$stateProvider'];

export default route;
