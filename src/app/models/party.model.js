export class Party {
  constructor(values) {
    this.host = '';
    this.password = '';
    this.guestList = []

    Object.assign(this, values);
  }
}