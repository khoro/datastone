import Validator from './validator';

export default class PresenceValidator extends Validator {
  static message = 'can\'t be blank';

  validate() {
    if (this.rule && !this.value) {
      this.record.errors.add(this.field, this.message);
    }
  }
}
