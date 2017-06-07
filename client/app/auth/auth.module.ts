import * as angular from 'angular';
import controller from './auth.controller';
import constants from './auth.constants';
const name = 'auth';
const template = '/client/app/auth/auth.html';

export default angular.module('app.auth', [constants])
  .component(name, {
    templateUrl: template,
    controller,
    controllerAs: 'vm',
    bindings: {
      $close: '&',
      $modalInstance: '='
    }
  })
  .name;
