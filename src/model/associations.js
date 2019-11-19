import _ from 'lodash';
import pluralize from 'pluralize';
import CollectionProxy from './collection-proxy';

const ASSOCIATIONS_TYPES = {
  belongsTo: Symbol('belongsTo'),
  hasOne: Symbol('hasOne'),
  hasMany: Symbol('hasMany')
}

export default Klass => {
  return class extends Klass {
    static get associations() {
      if(!this.__associations) {
        this.__associations = {};
      }

      return this.__associations;
    }

    static associate({ name, type }) {
      this.associations[name] = {
        type,
        model: _.startCase(pluralize.singular(name)),
        foreignKey: _.camelCase(this.name) + 'Id'
      }
    }

    static belongsTo(name) {
      this.associate({ name, type: ASSOCIATIONS_TYPES.belongsTo });
    }

    static hasOne(name) {
      this.associate({ name, type: ASSOCIATIONS_TYPES.hasOne });
    }

    static hasMany(name) {
      this.associate({ name, type: ASSOCIATIONS_TYPES.hasMany });
    }

    constructor(...args) {
      super(...args);
      this.association = {};

      Object.keys(this.constructor.associations).forEach(key => {
        const options = this.constructor.associations[key];
        this.association[key] = { loaded: false };

        if (options.type === ASSOCIATIONS_TYPES.hasMany) {
          const proxy = new CollectionProxy();
          proxy.model = this.constructor.__models[options.model];
          proxy.query = this.constructor.__models[options.model].where({ [options.foreignKey]: this.id });
          this[key] = proxy;
        } else {
          this[key] = this.getAssociationValue(key);
        }
      });
    }

    getAssociationValue(key) {
      return {
        then: async (fn) => {
          if (this.association[key].loaded) return fn(this.association[key].value);
          const type = this.constructor.associations[key].type;
          fn(await this[type](key));
        }
      }
    }

    async [ASSOCIATIONS_TYPES.hasOne](key) {
      const options = this.constructor.associations[key];
      const klass = this.constructor.__models[options.model];
      const data = await klass.findBy({ [options.foreignKey]: this.id });
      this.association[key].loaded = true;
      this.association[key].value = data;
      this[key] = data;
      return data;
    }

    async [ASSOCIATIONS_TYPES.belongsTo](key) {
      const options = this.constructor.associations[key];
      const klass = this.constructor.__models[options.model];
      const data = await klass.find(this[key + 'Id']);
      this.association[key].loaded = true;
      this.association[key].value = data;
      this[key] = data;
      return data;
    }
  }
}
