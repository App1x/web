class SongListCtrl {
  constructor() {}
}

let SongListComponent = {
  template: require('./song-list.html'),
  controller: SongListCtrl,
  bindings: {
    headers: '<',
    songs: '<',
    addSong: '&'
  }
}

export default SongListComponent;