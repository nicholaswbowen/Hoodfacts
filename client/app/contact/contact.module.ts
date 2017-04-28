import * as angular from 'angular';
import route from './contact.route';
import controller from './contact.controller';

const name = 'contact';
const template = '/client/app/contact/contact.html';

export default angular.module('app.contact', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm'
  })
  .config(route)
  .name;
