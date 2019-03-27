export default class Errors {
  messages = {};

  add(name, message) {
    this.messages[name] = this.messages[name] || [];
    this.messages[name].push(message);
  }

  toJSON() {
    return this.messages;
  }
}
