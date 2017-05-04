import angular from 'angular'
import * as firebase from 'firebase';

export class FirebaseService {

  constructor() {
    this.config = {
      apiKey: "AIzaSyBMPtIpoTX-tsTuMi3NtWdJrn_-9AuSl5k",
      authDomain: "djparty-74e77.firebaseapp.com",
      databaseURL: "https://djparty-74e77.firebaseio.com",
      storageBucket: "djparty-74e77.appspot.com",
      messagingSenderId: "530519324755"
    };
  }

  init() {
    firebase.initializeApp(config);
  }

  /**
   * Returns all of the parties in the DB
   */
  getParties(){
    return firebase.database().ref('parties');
  }
}
