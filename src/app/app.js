import angular from 'angular';
import ngRoute from 'angular-route';
import angularfire from 'angularfire';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import '../style/app.css';

// Config
import { configRoutes, configureFirebase } from './config';

// Services
import services from './services';

// Components
import LoginComponent from './login/login';
import NowPlayingComponent from './now-playing/now-playing';
import UserComponent from './user/user';
import SettingsComponent from './settings/settings';

import components from './components';



class AppCtrl {
  constructor($firebaseAuth, authService, partyService, $location) {
    this.$firebaseAuth = $firebaseAuth();
    this.auth = authService;
  }

  $onInit() {
    // Sign in the user anonymously when they load the app
    this.$firebaseAuth.$signInAnonymously()
    .then(user => {
      this.auth.user = user;
    });
  }
}
AppCtrl.$inject = ['$firebaseAuth', 'AuthService', '$location'];

let app = {
  template: require('./app.html'),
  controller: AppCtrl,
  controllerAs: 'app'
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [ngRoute, angularfire])
  .config(['$routeProvider', '$locationProvider', configRoutes])
  .config([configureFirebase])
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