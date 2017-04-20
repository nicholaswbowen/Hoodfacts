import * as angular from 'angular';

export default angular.module('app.auth.constants', [])
  .constant('AUTHENTICATION_STATUS', {
    success: 'login successful'
  })
  .constant('PATTERN', {
     user: /[a-z0-9]+([-{1}]|[_{1}]|[\.{1}])?([a-z0-9])+/
   })
  .name;
