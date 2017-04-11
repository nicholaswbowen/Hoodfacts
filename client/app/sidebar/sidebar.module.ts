import * as angular from 'angular';
import controller from './sidebar.controller';

const name = 'navigation';
const template = '/client/app/sidebar/sidebar.html';

export default angular.module('app.navigation', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
