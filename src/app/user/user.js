import { addSong } from '../actions/party.actions';
import { get } from 'lodash';
import { copy } from 'angular';

/* @ngInject */
class UserCtrl {
  constructor($ngRedux) {
    this.$ngRedux = $ngRedux;
  }

  $onInit() {
    this.$ngRedux.connect(this.mapStateToThis)(this);
  }

  mapStateToThis(state) {
    let username = state.guest.username;
    console.log(get(state.party, 'party.guests'));
    return {
      songs: get(state.party.party.guests[username], 'playlist', [])
    }
  }

  addSong(song) {
    let username = this.$ngRedux.getState().guest.username;
    this.$ngRedux.dispatch(addSong({username, song: copy(song)}))
  }
}


let UserComponent = {
  template: require('./user.html'),
  controller: UserCtrl
}

export default UserComponent;