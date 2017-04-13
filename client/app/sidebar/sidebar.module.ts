import * as angular from 'angular';
import controller from './sidebar.controller';

const name = 'sidebar';
const template = '/client/app/sidebar/sidebar.html';

export default angular.module('app.sidebar', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
