import Validator from './validator';
import _ from 'lodash';

export default class UniquenessValidator extends Validator {
  static message = 'has been taken';

  async validate() {
    if (!this.rule) return;
    const query = { [this.field]: this.value || null };

    if(this.rule.scope) {
      if(_.isArray(this.rule.scope)) {
        this.rule.scope.forEach(field => {
          query[field] = this.record[field] || null;
        });
      } else {
        query[this.rule.scope] = this.record[this.rule.scope] || null;
      }
    }

    let hasChange = false;

    Object.keys(query).forEach(field => {
      if (this.record.changed.has(field)) hasChange = true;
    });

    if(hasChange && await this.model.where(query).first) {
      this.record.errors.add(this.field, this.message);
    }
  }
}
