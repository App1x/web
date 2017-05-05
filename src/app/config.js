import * as firebase from 'firebase';
import { isEmpty } from 'lodash';
export function configRoutes($routeProvider, $locationProvider) {
  let originalWhen = $routeProvider.when;

  // Redirect the user anytime they don't have a party
  $routeProvider.when = (path, route) => {
    route.resolveRedirectTo = ['PartyService', '$location', (PartyService, $location) => {
      if (isEmpty(PartyService.party)) return '/';
      return $location.url(); 
    }];
    return originalWhen.call($routeProvider, path, route);
  }

  $routeProvider
    .when('/', {
      template: '<dj-login></dj-login>'
    })
    .when('/player', {
      template: '<dj-now-playing></dj-now-playing>'
    })
    .when('/user', {
      template: '<dj-user></dj-user>'
    })
    .when('/settings', {
      template: '<dj-settings></dj-settings>'
    });

    $locationProvider.html5Mode(true);
}

export function configureFirebase() {
  let config = {
    apiKey: "AIzaSyBMPtIpoTX-tsTuMi3NtWdJrn_-9AuSl5k",
    authDomain: "djparty-74e77.firebaseapp.com",
    databaseURL: "https://djparty-74e77.firebaseio.com",
    storageBucket: "djparty-74e77.appspot.com",
    messagingSenderId: "530519324755"
  };
  firebase.initializeApp(config);
}