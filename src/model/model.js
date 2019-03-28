import Relation from './relation';
import knex from 'knex';
import table from './table';
import validations from './validations';
import hooks from './hooks';

class Model {
  static __models = {};

  static register() {
    this.__models[this.name] = this;
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

  static findBy(...args) {
    return new Relation(this).findBy(...args);
  }
}

export default hooks(validations(table(Model)));
