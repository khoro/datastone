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

    get errors() {
      if(!this.__errors) this.__errors = new Errors();
      return this.__errors;
    }
  }
}
