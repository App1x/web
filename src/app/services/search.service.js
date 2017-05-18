import { Track } from '../models/track.model';

export class SearchService {
  constructor($http) {
    this.http = $http;
    this.spotifyUrl = 'https://api.spotify.com/v1/search';
    this.youtubeUrl = 'https://www.youtube.com/results'
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
      return result.tracks.items.map(track => {
        return {
          name: track.name,
          artists: track.artists.map(a => a.name).join(', '),
          duration: this.getTrackDuration(track.duration_ms),
          uri: track.uri 
        };
      });
    });
  }

  searchVideo(track) {
    return this.http.get(this.youtubeUrl, {
      params: {
        search_query: `${track.name} ${track.artists}`
      }
    })
    .then(res => {
      return {videoId: /watch\?v=(.+?)"/.exec(res.data)[1]};
    });
  }

  getTrackDuration(durationMs) {
    return Math.floor((durationMs/1000)/120)+':'+Math.floor((durationMs/1000)%120);
  }
}

SearchService.$inject = ['$http'];