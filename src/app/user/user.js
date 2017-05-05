class UserCtrl {
  constructor(guestService) {
    this.guestService = guestService;
  }

  addSong(song) {
    this.guestService.addSong(song);
  }
}

UserCtrl.$inject = ['GuestService'];

let UserComponent = {
  template: require('./user.html'),
  controller: UserCtrl
}

export default UserComponent;