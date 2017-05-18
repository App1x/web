import * as firebase from 'firebase';
import { get } from 'lodash';

const database = firebase.database;
export const partyActionsTypes = {
  CreatePartyRequested: 'CREATE_PARTY_REQUESTED',
  CreatePartyResolved: 'CREATE_PARTY_RESOLVED',
  CreatePartyRejected: 'CREATE_PARTY_REJECTED',
  CreatePartyCanceled: 'CREATE_PARTY_CANCELED',
  FetchPartyRequested: 'FETCH_PARTY_REQUESTED',
  FetchPartyResolved: 'FETCH_PARTY_RESOLVED',
  FetchPartyRejected: 'FETCH_PARTY_REJECTED',
  JoinPartyRequested: 'JOIN_PARTY_REQUESTED',
  JoinPartyResolved: 'JOIN_PARTY_RESOLVED',
  JoinPartyRejected: 'JOIN_PARTY_REJECTED',
  JoinPartyCanceled: 'JOIN_PARTY_CANCELED',
  AddSongRequested: 'ADD_SONG_REQUESTED',
  AddSongResolved: 'ADD_SONG_RESOLVED',
  AddSongRejected: 'ADD_SONG_REJECTED',
  NextSongRequested: 'NEXT_SONG_REQUESTED',
  NextSongResolved: 'NEXT_SONG_RESOLVED',
  NextSongRejected: 'NEXT_SONG_REJECTED'
};

/**
 * This thunk will handle creating a party
 * @param {{partyName: string, host: string, password: string}}
 */
export function createParty({ partyName, host, password }) {
  let party;
  return dispatch => {
    dispatch(createPartyRequested());
    return database().ref(`parties/${partyName}`).once('value')
      .then(snapshot => {
        // If the party exists, we want the user to join the party
        if (snapshot.val() !== null) {
          return Promise.reject('Party already exists');
        }
        // Party does not exist, we need to create it
        const partyRef = database().ref(`parties/${partyName}`);
        party = createPartyHelper({ partyName, host, password });
        return partyRef.update(party);
      })
      .then(() => {
        // Successfully created the party
        dispatch(createPartyResolved(party))
      })
      .catch(err => {
        // Party was not created
        dispatch(createPartyRejected(err))
      });
  }
}

/**
 * This thunk will add a user to a party
 * @param {{partyName: string, guest: string, password: string}}
 */
export function joinParty({ partyName, guest, password }) {
  return dispatch => {
    dispatch(joinPartyRequested())
    return database().ref(`parties/${partyName}`).once('value')
      .then(partyRef => {
        let party = partyRef.val();
        // If the party doesn't exist, we need to create it
        if (party === null) {
          return Promise.reject('Party does not exist!')
        }
        // If they don't have the right password, reject
        if (party.password && party.password !== password) {
          return dispatch(joinPartyRejected('Invalid password'));
        }
        let updatedParty = joinPartyHelper({ party, guest });
        return database().ref(`parties/${partyName}`).update(updatedParty);
      })
      .then(() => dispatch(fetchParty(partyName)))
      .catch(err => dispatch(joinPartyRejected(err)));
  }
}

export function fetchParty(partyName) {
  return dispatch => {
    dispatch(fetchPartyRequested());
    return database().ref(`parties/${partyName}`).once('value')
      .then((party) => {
        if (!party.val()) {
          return Promise.reject('Party does not exist');
        }
        dispatch(fetchPartyResolved(party.val()));
      })
      .catch(err => dispatch(fetchPartyRejected(err)))
  }
}

/**
 * This thunk will add a song to a users playlist
 * @param {{username: string, song: {}}}
 */
export function addSong({ username, song }) {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(addSongRequested());
    let partyName = get(state.party, 'party.partyName');
    return database().ref(`parties/${partyName}/guests/${username}`).once('value')
      .then(userRef => {
        let user = userRef.val();
        if (!user) {
          return Promise.reject('User does not exist');
        }
        user.playlist = user.playlist || [];
        user.playlist.push(song);
        return database().ref(`parties/${partyName}/guests/${username}`).update(user);
      })
      .then(() => dispatch(fetchParty(partyName)))
      .catch(err => dispatch(addSongRejected(err)));
  }
}

export function nextSong() {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(nextSongRequested());
    let partyName = get(state.party, 'party.partyName');
    return database().ref(`parties/${partyName}`).once('value')
      .then(partyRef => {
        let party = partyRef.val();
        if (!party) {
          return Promise.reject('Party does not exist');
        }
        // Get the next person in the queue
        // TODO: Loop through in case someone doesn't have songs added
        let [nextUp, ...rest] = party.guestQueue;
        // Get the next song in that persons queue
        let [nextSong, ...restSongs] = party.guests[nextUp].playlist;
        party.nowPlaying = nextSong;
        party.guests[nextUp].playlist = restSongs;
        party.guestQueue = [...rest, nextUp];
        return database().ref(`parties/${partyName}`).update(party);
      })
      .then(() => dispatch(nextSongResolved()))
      .then(() => dispatch(fetchParty(partyName)))
      .catch(err => dispatch(nextSongRejected(err)));
  }
}

/**
 * Simple action creators
 */
const fetchPartyRequested = () => ({ type: partyActionsTypes.FetchPartyRequested });
const fetchPartyResolved = (party) => ({ type: partyActionsTypes.FetchPartyResolved, party });
const fetchPartyRejected = (err) => ({ type: partyActionsTypes.FetchPartyRejected, party });
const nextSongRequested = () => ({ type: partyActionsTypes.NextSongRequested });
const nextSongResolved = () => ({ type: partyActionsTypes.NextSongResolved });
const nextSongRejected = (err) => ({ type: partyActionsTypes.NextSongRejected, err });
const addSongRequested = () => ({type: partyActionsTypes.AddSongRequested});
const addSongRejected = (err) => ({type: partyActionsTypes.AddSongRejected, err});
const joinPartyRequested = () => ({type: partyActionsTypes.JoinPartyRequested});
const joinPartyResolved = () => ({type: partyActionsTypes.JoinPartyResolved});
const joinPartyRejected = (err) => ({type: partyActionsTypes.JoinPartyRejected, err});
const createPartyRequested = () => ({type: partyActionsTypes.CreatePartyRequested});
const createPartyResolved = () => ({type: partyActionsTypes.CreatePartyResolved, party});
const createPartyRejected = (err) => ({type: partyActionsTypes.createPartyRejected, err});

// Helper methods
/**
 * This will construct a party object to store in firebase
 */
function createPartyHelper({ partyName, host, password }) {
  return {
    host,
    guestQueue: [host],
    guests: { [host]: { playlist: [], name: host } },
    password,
    partyName
  }
}

/**
 * This will add a user to the party
 */
function joinPartyHelper({ party, guest }) {
  if (party.guests[guest]) {
    return party;
  }
  party.guestQueue = [...party.guestQueue, guest];
  party.guests[guest] = { playlist: [], name: guest };
  return party;
}

