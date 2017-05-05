import angular from 'angular';

export class AuthService {
  constructor() {
    this.OAUTH2_CLIENT_ID = '530519324755-n4l6i4jngb9q9244c9k77na4pcha0pnp.apps.googleusercontent.com';
    this.OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];
    this.user = {}
  }
}