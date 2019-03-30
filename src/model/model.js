import Relation from './relation';
import knex from 'knex';
import table from './table';
import validations from './validations';
import hooks from './hooks';
import mutations from './mutations';

class Model {
  static __models = {};

  static register() {
    this.__models[this.name] = this;
  }

  static disconnect() {
    return this.__knex.destroy();
  }

  static async configure(config) {
    this.__knex = knex(config);
    await this.__loadModels();
  }

  static async __loadModels() {
    await Promise.all(
      Object.values(this.__models)
            .map(model => model.__loadTable())
    );
  }

  static get all() {
    return new Relation(this).all;
  }

  static get none() {
    return new Relation(this).none;
  }

  static count(...args) {
    return new Relation(this).count(...args);
  }

  static sum(...args) {
    return new Relation(this).sum(...args);
  }

  static where(...args) {
    return new Relation(this).where(...args);
  }

  static get first() {
    return new Relation(this).first;
  }

  static get last() {
    return new Relation(this).last;
  }

  static findBy(...args) {
    return new Relation(this).findBy(...args);
  }

  static find(...args) {
    return new Relation(this).find(...args);
  }

  static limit(...args) {
    return new Relation(this).limit(...args);
  }

  static offset(...args) {
    return new Relation(this).offset(...args);
  }

  static order(...args) {
    return new Relation(this).order(...args);
  }
}

export default mutations(hooks(validations(table(Model))));
