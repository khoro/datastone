import _ from 'lodash';
import pluralize from 'pluralize';

export default Klass => {
  return class extends Klass {
    static get tableName() {
      return _.snakeCase(pluralize(this.name));
    }

    static get knex() {
      return this.__knex(this.tableName);
    }

    static async __loadTable() {
      this.columns = await this.knex.columnInfo();

      Object.keys(this.columns).forEach(column => {
        Object.defineProperty(this.prototype, column, {
          get() {
            return this.attributes[column];
          },
          set(value) {
            this.attributes[column] = value;
          }
        });
      });
    }

    attributes = {};

    constructor(values) {
      super(values);
      this.set(values);
    }

    set(key, value) {
      if (!key) return;
      let attrs;

      if (_.isString(key)) {
        attrs = {};
        attrs[key] = val;
      } else {
        attrs = key;
      }

      _.each(attrs, (val, key) => {
        this[key] = _.isNaN(val) ? null : val;
      });
    }
  }
}
