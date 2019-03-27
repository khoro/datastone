export default Klass => {
  return class extends Klass {
    static get hooks() {
      if(!this.__hooks) {
        this.__hooks = {
          beforeCreate: [],
          beforeDestroy: []
        }
      }

      return this.__hooks;
    }

    static beforeCreate(fn) {
      this.hooks.beforeCreate.push(fn);
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
