import Model from './model/model';
import * as validators from './validators';

for(let i in validators) {
  Model.registerValidator(validators[i]);
}

export { Model };
