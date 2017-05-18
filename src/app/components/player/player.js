import * as YouTubeIFrameLoader from 'youtube-iframe';

/* @ngInject */
class PlayerCtrl {
  constructor(SearchService, $ngRedux) {
    this.search = SearchService;
  }

  $onInit() {
    YouTubeIFrameLoader.load( YT => {
      this.player = new YT.Player('player', {
        height: '100',
        width: '300',
      });
      this.loadTrack(this.track);
    });
  }

  $onChanges(changes) {
    if (changes.track && !changes.track.isFirstChange()) {
      this.loadTrack(this.track);
    }
  }

  loadTrack(track) {
    if (!track) return;
    this.search.searchVideo(track)
    .then( videoId => this.player.loadVideoById(videoId));
  }
};

let PlayerComponent = {
  template: require('./player.html'),
  controller: PlayerCtrl,
  bindings: {
    track: '<'
  }
};

export default PlayerComponent;