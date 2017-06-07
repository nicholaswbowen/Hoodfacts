
class UsersIndexController {
      public currentUser;
      public profileID;
      public profile;
      public users;
      public username;
    constructor(
      private UserService,
      private $state: ng.ui.IStateService,
      private toastr,
      SessionService,
      $stateParams
    ) {
      this.currentUser = SessionService.getUser();
      this.getUsers();
      }
      public getUsers() {
        this.UserService.listUsers().then ((users) => {
          this.users = users;
       }).catch ((err) => {
         this.toastr.error('Could not find users.');
        });

      }
      public delete (username) {
        if (confirm ('Are you sure you want to delete this?')) {
          this.UserService.deleteUser(username).then(() => {
            this.toastr.success(`${username} Has been DELETED!`, `Fantastic!`);
              this.$state.go('usersIndex', null, { reload: true, notify: true });
          }).catch((err) => {
            this.toastr.error('Hold up! You know you CAN NOT DELETE ADMIN FOO!!.');
          });
        }
      }
  };

UsersIndexController.$inject = [
  'UserService',
  '$state',
  'toastr',
  'SessionService',
  '$stateParams'
];

export default UsersIndexController;
