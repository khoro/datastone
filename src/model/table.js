import _ from 'lodash';
import pluralize from 'pluralize';

export default Klass => {
  return class extends Klass {
    static get tableName() {
      return _.snakeCase(pluralize(this.name));
    }
  }
}
