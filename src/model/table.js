import _ from 'lodash';
import pluralize from 'pluralize';

export default Klass => {
  return class extends Klass {
    static get tableName() {
      return _.snakeCase(pluralize(this.name));
    }

    static get columnNames() {
      return Object.keys(this.columns);
    }

    static get knex() {
      return this.__knex(this.tableName);
    }

    static async __loadTable() {
      if (this.columns) return;
      this.columns = await this.knex.columnInfo();

      Object.keys(this.columns).forEach(column => {
        Object.defineProperty(this.prototype, column, {
          get() {
            return this.attributes[column];
          },
          set(value) {
            if (this.attributes[column] !== value) {
              this.changed.add(column);
            }

            this.attributes[column] = value;
          }
        });
      });
    }

    attributes = {};
    changed = new Set();

    constructor(values) {
      super(values);
      this.set(values);
      if (this.id) this.changed = new Set();
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
