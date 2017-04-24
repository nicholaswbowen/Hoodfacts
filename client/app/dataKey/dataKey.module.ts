import * as angular from 'angular';
import controller from './dataKey.controller';

const name = 'dataKey';
const template = '/client/app/dataKey/dataKey.html';

export default angular.module('app.dataKey', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
