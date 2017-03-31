import * as angular from 'angular';
import controller from './navigation.controller';

const name = 'navigation';
const template = '/client/app/navigation/navigation.html';

export default angular.module('app.navigation', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
