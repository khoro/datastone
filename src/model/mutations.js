import _ from 'lodash';

export default Klass => {
  return class extends Klass {
    async save() {
      let result;
      const date = new Date().toUTCString();

      await this.trigger('beforeSave');

      if(this.id) {
        await this.trigger('beforeUpdate');
        this.set({ updatedAt: date });
        result = await this.constructor.knex.where({ id: this.id }).update(
          _.pick(this.attributes, ...this.updatedAttributes),
          this.constructor.columnNames
        );
        await this.trigger('afterUpdate');
      } else {
        await this.trigger('beforeCreate');
        this.set({ createdAt: date, updatedAt: date });
        result = await this.constructor.knex.insert(
          _.pick(this.attributes, ...this.updatedAttributes),
          this.constructor.columnNames
        );
        await this.trigger('afterCreate');
      }

      await this.trigger('afterSave');

      this.set(result[0]);
    }

    async destroy() {
      await this.trigger('beforeDestroy');
      await this.constructor.knex.where({ id: this.id }).del();
      await this.trigger('afterDestroy');
    }
  }
}
