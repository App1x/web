export class Track {
  constructor(options) {
    this.name = '';
    this.artists = '';
    this.uri = '';
    this.duration = 0;

    Object.assign(this, options);
  }
}