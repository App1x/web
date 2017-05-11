export class Actions {
  constructor() {}

  setParty(partyRef) {
    return {
      type: 'SET_PARTY',
      partyRef
    }
  }

  changeHost(host) {
    return {
      type: 'CHANGE_HOST',
      host
    }
  }

  setCurrentUser(userRef) {
    return {
      type: 'SET_CURRENT_USER',
      userRef
    }
  }
}