
class UsersIndexController {
      public currentUser;
      public profileID;
      public profile;
      public users;
      public alerts = [];
    constructor(
      private UserService,
      private $state: ng.ui.IStateService,
      SessionService,
      $stateParams
    ) {
      this.currentUser = SessionService.getUser();
      this.getUsers();
      console.log('Show me my users');
      }
      public getUsers() {
        this.UserService.listUsers().then ((users) => {
          this.users = users;
          console.log('I see my list! Yaaay!!!');
       }).catch ((err) => {
         this.alerts.push({type: 'warning', message: 'Could not find users.'});
        });

      }
      public delete (username) {
        confirm('Are you sure you want to delete this?');
          this.UserService.deleteUser(username).then(() => {
              this.$state.go('usersIndex', null, { reload: true, notify: true });
          }).catch((err) => {
            this.alerts.push({type: 'danger', message: 'Could not delete User.'});
          });
      }
  };

UsersIndexController.$inject = [
  'UserService',
  '$state',
  'SessionService',
  '$stateParams'
];

export default UsersIndexController;
