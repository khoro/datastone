import _ from 'lodash';

export default Klass => {
  return class extends Klass {
    static get hooks() {
      if(!this.__hooks) {
        this.__hooks = {
          beforeSave: [],
          afterSave: [],
          beforeCreate: [],
          afterCreate: [],
          beforeUpdate: [],
          afterUpdate: [],
          beforeDestroy: [],
          afterDestroy: [],
          beforeValidate: []
        }
      }

      return this.__hooks;
    }

    static beforeSave(fn) {
      this.hooks.beforeSave.push(fn);
    }

    static afterSave(fn) {
      this.hooks.afterSave.push(fn);
    }

    static beforeCreate(fn) {
      this.hooks.beforeCreate.push(fn);
    }

    static afterCreate(fn) {
      this.hooks.afterCreate.push(fn);
    }

    static beforeUpdate(fn) {
      this.hooks.beforeUpdate.push(fn);
    }

    static afterUpdate(fn) {
      this.hooks.afterUpdate.push(fn);
    }

    static beforeDestroy(fn) {
      this.hooks.beforeDestroy.push(fn);
    }

    static afterDestroy(fn) {
      this.hooks.afterDestroy.push(fn);
    }

    static beforeValidate(fn) {
      this.hooks.beforeValidate.push(fn);
    }

    async trigger(hook) {
      for(let fn of this.constructor.hooks[hook]) {
        if (_.isFunction(fn)) {
          await fn(this);
        } else {
          await this[fn]();
        }
      }
    }
  }
}
