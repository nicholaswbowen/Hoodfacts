import * as angular from 'angular';
import controller from './boundaries.controller';

const name = 'boundaries';
const template = '/client/app/boundaries/boundaries.html';

export default angular.module('app.boundaries', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
