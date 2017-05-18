import { combineReducers } from 'redux';
import createStorageMiddleware, { getStorageState } from 'redux-simple-storage-middleware';
import { partyActionsTypes } from './actions/party.actions';
import { guestActionsTypes } from './actions/guest.actions';

export const sessionStorageMiddleware = createStorageMiddleware({
  key: 'djparty-sessionstorage'
});

export const storageState = getStorageState({
    key: 'djparty-sessionstorage',
    type: 'sessionStorage',
    defaultReponse: {} 
  });

// Common functions for reducers
const asyncRequestStarted = state => {
  return {...state, inProgress: true}
}
const asyncRequestEnded = (state, action) => {
  return {...state, inProgress: false, error: action.error}
}

const party = (state = {}, action) => {
  const addParty = (state, action) => {
    return {...state, party: action.party, inProgress: false}
  }
  const reducers = {
    [partyActionsTypes.CreatePartyRequested]: asyncRequestStarted,
    [partyActionsTypes.CreatePartyRejected]: asyncRequestEnded,
    [partyActionsTypes.CreatePartyResolved]: addParty,
    [partyActionsTypes.JoinPartyRequested]: asyncRequestStarted,
    [partyActionsTypes.JoinPartyRejected]: asyncRequestEnded,
    [partyActionsTypes.JoinPartyResolved]: addParty,
    [partyActionsTypes.FetchPartyRequested]: asyncRequestStarted,
    [partyActionsTypes.FetchPartyRejected]: asyncRequestEnded,
    [partyActionsTypes.FetchPartyResolved]: addParty,
    [partyActionsTypes.NextSongRequested]: asyncRequestStarted,
    [partyActionsTypes.AddSongRejected]: asyncRequestEnded
    
  }
  return reducers[action.type] ? reducers[action.type](state, action) : state;
}

const guest = (state = {}, action) => {
  const addCurrentUser = (state, action) => {
    return {...state, username: action.username}
  }
  const reducers = {
    [guestActionsTypes.AddCurrentUser]: addCurrentUser
  }
  return reducers[action.type] ? reducers[action.type](state, action) : state;
}


// Main app state
export const djparty = combineReducers({
  party,
  guest
});