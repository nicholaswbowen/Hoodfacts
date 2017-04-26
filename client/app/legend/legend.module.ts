import * as angular from 'angular';
import controller from './legend.controller';
import "./legend.scss";
const name = 'legend';
const template = '/client/app/legend/legend.html';

export default angular.module('app.legend', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .name;
