import * as angular from 'angular';
import route from './about.route';
import controller from './about.controller';

const name = 'about';
const template = '/client/app/about/about.html';

export default angular.module('app.about', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .config(route)
  .name;
 
