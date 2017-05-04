class SongSearchCtrl {
  constructor(searchService) {
    this.searchService = searchService;
    this.searchResults = [];
    this.searchText = '';
  }

  search() {
    this.searchService.searchTrack(this.searchText)
    .then((tracks) => {
      console.log(tracks);
      this.searchResults = tracks;
    })
    .catch(err => {
      console.log(err);
    });
  }
}

SongSearchCtrl.$inject = [ 'SearchService' ];

let SongSearchComponent = {
  template: require('./song-search.html'),
  controller: SongSearchCtrl
};

export default SongSearchComponent;