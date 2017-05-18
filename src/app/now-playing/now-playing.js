import { get } from 'lodash';
/* @ngInject */
class NowPlayingCtrl {
  constructor($ngRedux) {
    this.$ngRedux = $ngRedux;
  }

  $onInit() {
    this.$ngRedux.connect(this.mapStateToThis)(this);
  }

  mapStateToThis(state) {
    return {
      party: state.party.party,
      songs: getFirstSongForEachGuest(state.party.party.guests, state.party.party.guestQueue)
    }
  }

}

function getFirstSongForEachGuest(guests, queue) {
  let songs = [];
  queue.forEach(guest => {
    songs.push(get(guests[guest], 'playlist[0]'));
  });
  return songs;
}

let NowPlayingComponent = {
  template: require('./now-playing.html'),
  controller: NowPlayingCtrl
}
export default NowPlayingComponent;