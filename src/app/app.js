import angular from 'angular';
import ngRoute from 'angular-route';
import * as firebase from 'firebase';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import '../style/app.css';

// Config
import { configRoutes } from './config';

// Services
import services from './services';

// Components
import LoginComponent from './login/login';
import NowPlayingComponent from './now-playing/now-playing';
import PlayerComponent from './player/player';
import UserComponent from './user/user';
import SettingsComponent from './settings/settings';

import components from './components';



class AppCtrl {
  constructor(firebase) {
    this.url = 'https://github.com/preboot/angular-webpack';
    this.firebase = firebase;
  }
}
AppCtrl.$inject = ['FirebaseService'];

let app = {
  template: require('./app.html'),
  controller: AppCtrl,
  controllerAs: 'app'
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [ngRoute])
  .config(['$routeProvider', '$locationProvider', configRoutes])
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