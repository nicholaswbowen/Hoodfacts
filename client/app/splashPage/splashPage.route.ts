const route = function route($stateProvider) {
  $stateProvider
    .state('splashPage', {
      parent: 'main',
      url: '/splashPage',
      template: '<splash-page></splash-page>',
      resolve: {
        setToken: ['$location', '$localStorage', ($location, $localStorage) => {
          let token = $location.search().token;
          return token && !$localStorage['token']
            ? ($localStorage.token = token) && ($location.search('') && $location.search({}))
            : null;
        }]
      }
    });
};

route.$inject = ['$stateProvider'];

export default route;
