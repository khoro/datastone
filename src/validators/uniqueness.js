import Validator from './validator';

export default class UniquenessValidator extends Validator {
  static message = 'has been taken';

  async validate() {
    if(this.rule && await this.model.where({ [this.field]: this.value }).first) {
      this.record.errors.add(this.field, this.message);
    }
  }
}
