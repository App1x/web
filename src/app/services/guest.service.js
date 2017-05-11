import * as firebase from 'firebase';
import { find } from 'lodash';
import { Guest } from '../models/guest.model';

/* @ngInject */
export class GuestService {
  constructor($ngRedux, Actions, $firebaseObject) {
    this.ngRedux = $ngRedux;
    this.actions = Actions;
    this.$firebaseObject = $firebaseObject;
  }

  addSong(songObj) {
    let state = this.ngRedux.getState();
    let partyRef = state.party
    let currentUserRef = state.user;
    let user = this.$firebaseObject(currentUserRef);
    debugger;
    user.$loaded()
    .then(user => {
      let playlist = user.playlist || [];
      playlist.push(songObj);
      user.playlist = playlist;
      return user.$save()
    })
    partyRef.guests[currentUser.name].playlist = playlist;
    // Update the party and save it to the redux store
    return partyRef.$save()
    .then( party => {
      this.$ngRedux.dispatch(this.actions.setParty(party));
    });
  }
}
