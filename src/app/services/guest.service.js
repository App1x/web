import * as firebase from 'firebase';
import { find } from 'lodash';
import { Guest } from '../models/guest.model';

export class GuestService {
  constructor(partyService) {
    this.partyService = partyService;
    this.guest = new Guest();
  }

  addSong(songObj) {
    let party = this.partyService.party;
    debugger;
    if (!this.guest.name) return;
    if (!party) return;
    // Update the guest with the song
    return party.child('guestList').child(this.guest.name).transaction( guest => {
      guest.playlist[songObj.id] = songObj;
      this.guest = guest;
      return guest;
    });
  }
}

GuestService.$inject = ['PartyService']