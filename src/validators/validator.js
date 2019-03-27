export default class Validator {
  constructor(record, field, value, rule, message) {
    this.record = record;
    this.model = record.constructor;
    this.field = field;
    this.value = value;
    this.rule = rule;
    this.message = message || this.constructor.message;
  }
}
