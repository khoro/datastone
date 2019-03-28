export default Klass => {
  return class extends Klass {
    static get hooks() {
      if(!this.__hooks) {
        this.__hooks = {
          beforeSave: [],
          beforeCreate: [],
          beforeUpdate: [],
          beforeDestroy: []
        }
      }

      return this.__hooks;
    }

    static beforeSave(fn) {
      this.hooks.beforeSave.push(fn);
    }

    static beforeCreate(fn) {
      this.hooks.beforeCreate.push(fn);
    }

    static beforeUpdate(fn) {
      this.hooks.beforeUpdate.push(fn);
    }

    static beforeDestroy(fn) {
      this.hooks.beforeDestroy.push(fn);
    }

    async trigger(hook) {
      for(let fn of this.constructor.hooks[hook]) {
        await fn();
      }
    }
  }
}
