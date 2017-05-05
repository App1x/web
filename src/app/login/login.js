import angular from 'angular';
import { Guest } from '../models/guest.model';


class LoginCtrl {
  constructor(partyService, guestService, location) {
    this.partyService = partyService
    this.location = location;
    this.guestService = guestService;

    this.partyName = '';
    this.password = '';
    this.username = '';
  }

  createOrJoinParty() {
    this.partyService.getParty(this.partyName).transaction( party => {
      // Set the current guest
      let guest = new Guest({name: this.username});
      this.guestService.guest = guest;
      // Check to see if the party exists
      if (party) {
        return this.partyService.joinParty(party, guest)
      }
      return this.partyService.createParty(this.partyName, this.password, guest);
    })
    .then(() => {
      console.log(this.location.path());
      this.location.path('/player');
    })
    .catch(err => console.log(err));
  }

}
LoginCtrl.$inject = ['PartyService', 'GuestService', '$location'];

let LoginComponent = {
  template: require('./login.html'),
  controller: LoginCtrl
}
export default LoginComponent
