import { Guest } from '../models/guest.model';
import { Party } from '../models/party.model'
import * as firebase from 'firebase';

/* @ngInject */
export class PartyService {

  constructor($firebaseObject, Actions, $ngRedux) {
    this.$firebaseObject = $firebaseObject;
    this.actions = Actions;
    this.ngRedux = $ngRedux;
  }
}

