class NowPlayingCtrl {
  constructor() {}

  managePlaylist() {
    console.log('managed')
  }
}

let NowPlayingComponent = {
  template: require('./now-playing.html'),
  controller: NowPlayingCtrl
}
export default NowPlayingComponent;