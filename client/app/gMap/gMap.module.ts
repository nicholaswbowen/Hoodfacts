import * as angular from 'angular';
import controller from './gMap.controller';

const name = 'gMap';
const template = '/client/app/gMap/gMap.html';

export default angular.module('app.gMap', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
