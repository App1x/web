import { Track } from '../models/track.model';

export class SearchService {
  constructor($http) {
    this.http = $http;
    this.spotifyUrl = 'https://api.spotify.com/v1/search'
  }

  searchTrack(track, page = 1, limit = 5) {
    return this.http.get(this.spotifyUrl, {
      params: {
        q: track,
        type: 'track',
        limit: limit,
        offset: limit * ( page - 1)
      }
    })
    .then( result => result.data )
    .then(result => {
      console.log(result);
      return result.tracks.items.map(track => {
        return new Track({
          name: track.name,
          artists: track.artists.map(a => a.name).join(', '),
          duration: this.getTrackDuration(track.duration_ms),
        });
      });
    });
  }

  getTrackDuration(durationMs) {
    return Math.floor((durationMs/1000)/120)+':'+Math.floor((durationMs/1000)%120);
  }
}

SearchService.$inject = ['$http'];