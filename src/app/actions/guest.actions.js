import * as firebase from 'firebase';
const database = firebase.database;

export const guestActionsTypes = {
  AddCurrentUser: 'ADD_CURRENT_USER'
}

/**
 * This will set the current user in the state
 */
export function addCurrentUser(username) {
  return {
    type: guestActionsTypes.AddCurrentUser,
    username
  }
}