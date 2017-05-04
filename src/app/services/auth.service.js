import angular from 'angular';

class AuthService {
  OAUTH2_CLIENT_ID = '530519324755-n4l6i4jngb9q9244c9k77na4pcha0pnp.apps.googleusercontent.com';
  OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];
  constructor() {}
}

angular.module('app')
  .service('AuthService', AuthService);