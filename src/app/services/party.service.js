import { Guest } from '../models/guest.model';
import { Party } from '../models/party.model'
import * as firebase from 'firebase';

import { fetchParty } from '../actions/party.actions';

/* @ngInject */
export class PartyService {

  constructor($firebaseObject, Actions, $ngRedux) {
    this.$firebaseObject = $firebaseObject;
    this.actions = Actions;
    this.ngRedux = $ngRedux;
    this.listener = null;
  }

  setupPartyListner(partyName) {
    if (this.listener) {
      // turn off the listener before making a new one
      this.unlisten();
     
    }
    firebase.database().ref(`parties/${partyName}`).on('values', () => fetchParty(partyName));
  }

  unlisten() {
    firebase.database().ref(`parties/${pathName}`).off('values');
  }


}

