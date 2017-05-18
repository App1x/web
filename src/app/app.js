import angular from 'angular';
import ngRoute from 'angular-route';
import angularfire from 'angularfire';
import ngRedux from 'ng-redux';
import { get } from 'lodash';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import '../style/app.css';

// Config
import { configRoutes, configureFirebase } from './config';

// Services
import services from './services';
import { fetchParty } from './actions/party.actions';

// Components
import LoginComponent from './login/login';
import NowPlayingComponent from './now-playing/now-playing';
import UserComponent from './user/user';
import SettingsComponent from './settings/settings';

import components from './components';

import { djparty, sessionStorageMiddleware, storageState } from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';


/* @ngInject */
class AppCtrl {
  constructor($firebaseAuth, $ngRedux) {
    this.$firebaseAuth = $firebaseAuth();
    this.$ngRedux = $ngRedux;
  }

  $onInit() {
    // Sign in the user anonymously when they load the app
    return this.$firebaseAuth.$signInAnonymously()
    .then(user => { /* Keep track of user */})
    .then(() => {
      let state = this.$ngRedux.getState();
      let partyName = get(state.party, 'party.partyName');
      if (partyName) {
        return this.$ngRedux.dispatch(fetchParty(partyName));
      } 
    });
  }
}

let app = {
  template: require('./app.html'),
  controller: AppCtrl,
  controllerAs: 'app'
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [ngRoute, angularfire, ngRedux])
  .config(['$routeProvider', '$locationProvider', configRoutes])
  .config([configureFirebase])
  .config(['$ngReduxProvider', ($ngReduxProvider) => {
    $ngReduxProvider.createStoreWith(djparty, [thunk, sessionStorageMiddleware, logger], null, storageState);
  }])
  .component('app', app)
  .component('djLogin', LoginComponent)
  .component('djNowPlaying', NowPlayingComponent)
  .component('djUser', UserComponent)
  .component('djSettings', SettingsComponent);


// Register shared stuff
Object.keys(components).forEach(c => {
  angular.module(MODULE_NAME).component(c, components[c]);
});
Object.keys(services).forEach(s => {
  angular.module(MODULE_NAME).service(s, services[s]);
});


export default MODULE_NAME;