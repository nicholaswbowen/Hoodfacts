import * as angular from 'angular';
import route from './profile.route';
import controller from './profile.controller';

const name = 'profile';
const template = '/client/app/profile/profile.html';

export default angular.module('app.profile', [])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm',
    bindings: {
      profile: '<'
    }})
    .config(route)
    .name;
