import Errors from './errors';
import _ from 'lodash';

const validators = {};

export default Klass => {
  return class extends Klass {
    static get validations() {
      if(!this.__validations) this.__validations = [];
      return this.__validations;
    }

    static get validators() {
      return validators;
    }

    static registerValidator(validator) {
      const name = _.camelCase(validator.name.replace('Validator', ''));
      validators[name] = validator;
    }

    static validates(field, validations) {
      this.validations.push({ field, validations });
    }

    get errors() {
      if(!this.__errors) this.__errors = new Errors();
      return this.__errors;
    }

    get isValid() {
      this.__errors = new Errors();

      return new Promise(async (resolve) => {
        await this.trigger('beforeValidate');

        for(let item of this.constructor.validations) {
          for(let validatorName in item.validations) {
            const ValidatorClass = this.constructor.validators[validatorName];
            const validator = new ValidatorClass(
              this,
              item.field,
              this[item.field],
              item.validations[validatorName]
            );

            await validator.validate();
          }
        }

        resolve(!Object.keys(this.errors.messages).length);
      });
    }
  }
}
