import * as angular from 'angular';

export class ProfileServiceClass {
    public ProfileResource;
    constructor(
      private $resource: ng.resource.IResourceService) {
        this.ProfileResource = $resource('/api/profile/:username', {username: '@username'});

}
    public getProfile(username) {
      return this.ProfileResource.get({username}).$promise;
  }
};
ProfileServiceClass.$inject = ['$resource'];

export const ProfileService = angular.module('app.services.profile', [])
    .service('ProfileService', ProfileServiceClass)
    .name;
