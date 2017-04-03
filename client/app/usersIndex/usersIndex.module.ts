import * as angular from 'angular';
import controller from './usersIndex.controller';
import route from './usersIndex.route';

    const name = 'usersIndex';
    const template = '/client/app/usersIndex/usersIndex.html';

  export default angular.module('app.usersIndex', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm',
  })
  .config(route)
  .name;
