import { Guest } from '../models/guest.model';
import { Party } from '../models/party.model'
import * as firebase from 'firebase';

export class PartyService {
  constructor() {
    this.party = {};
  }

  createParty(name, password, host) {
    let guestList = { [host.name]: host }
    let party = new Party({host: host.name, password, guestList});
    this.party = party;
    return party;
  }

  joinParty(party, guest) {
    party.guestList = party.guestList || {};
    party.guestList[guest.name] = guest;
    this.party = party;
    return party;
  }

  /**
   * Sets the host for a specific party
   */
  setPartyHost(hostname, partyName) {
    let party = this.getParty(partyName);
    party.update({host: hostname});
  }

  /**
   * Returns all of the parties in the DB
   */
  getParties() {
    return firebase.database().ref('parties');
  }

  /**
   * Return a specific party
   */
  getParty(partyName) {
    return this.getParties().child(partyName);
  }
}
