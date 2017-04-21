import * as angular from 'angular';
import controller from './selectMetric.controller';

const name = 'selectMetric';
const template = '/client/app/selectMetric/selectMetric.html';

export default angular.module('app.selectMetric', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
