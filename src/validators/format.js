import Validator from './validator';

export default class FormatValidator extends Validator {
  static message = 'is invalid';

  validate() {
    if (!this.rule) return;

    const passed = (this.rule.with || this.rule.without).test(this.value);

    if ((this.rule.with && !passed) || (this.rule.without && passed)) {
      this.record.errors.add(this.field, this.message);
    }
  }
}
