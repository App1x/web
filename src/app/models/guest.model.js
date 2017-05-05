export class Guest {
  constructor(values) {
    values = values || {};
    this.name = '';
    this.playlist = [];

    Object.assign(this, values);
  }
}