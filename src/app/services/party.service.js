export class PartyService {
  constructor(firebase) {
    this.firebase = firebase
  }

  /**
   * Creates a party and sets the user as the host
   */
  createParty(name, password, hostname) {
    let parties = this.firebase.getParties();
    parties.push({})
  }

  addUserToParty(user, party) {
    
  }
}

PartyService.$inject = ['FirebaseService'];