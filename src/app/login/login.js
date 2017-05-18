import angular from 'angular';
import * as firebase from 'firebase';
import { Guest } from '../models/guest.model';
import { joinParty, createParty } from '../actions/party.actions';
import { addCurrentUser } from '../actions/guest.actions';

/* @ngInject */
class LoginCtrl {
  constructor(PartyService, $ngRedux, $location) {
    this.partyService = PartyService;
    this.location = $location;
    this.$ngRedux = $ngRedux;

    this.partyName = '';
    this.password = '';
    this.username = '';
  }

  createOrJoinParty() {
    firebase.database().ref(`parties/${this.partyName}`).once('value')
    .then( partyRef => {
      if (!partyRef.val()) {
        return this.$ngRedux.dispatch(createParty({
          partyName: this.partyName,
          host: this.username,
          password: this.password
        }));
      }
      return this.$ngRedux.dispatch(joinParty({
        partyName: this.partyName,
        guest: this.username,
        password: this.password
      }));
    })
    .then(() => {
      this.$ngRedux.dispatch(addCurrentUser(this.username));
      this.location.url('/user');
    });
  }
}

let LoginComponent = {
  template: require('./login.html'),
  controller: LoginCtrl
}
export default LoginComponent
