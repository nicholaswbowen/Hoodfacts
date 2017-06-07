import * as angular from 'angular';
import controller from './splashPage.controller';
import route from './splashPage.route';

const name = 'splashPage';
const template = '/client/app/splashPage/splashPage.html';

export default angular.module('app.splashPage', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .config(route)
  .name;
