import _ from 'lodash';

export default class Relation {
  constructor(model) {
    this.model = model;
    this.query = this.model.knex;
  }

  get all() {
    return this;
  }

  get none() {
    this.query = this.query.where(1, 2);
    return this;
  }

  count() {
    this.query = this.query.count('*');

    return new Promise((resolve, reject) => {
      this.query.then(result => {
        resolve(result[0]['count(*)'])
      })
      .catch(reject);
    });
  }

  sum(field) {
    this.query = this.query.sum(field);

    return new Promise((resolve, reject) => {
      this.query.then(result => {
        resolve(Object.values(result[0])[0]);
      })
      .catch(reject);
    });
  }

  where(query, ...values) {
    if(_.isPlainObject(query)) {
      this.query = this.query.where(query)
    } else {
      this.query = this.query.whereRaw(query, values);
    }

    return this;
  }

  get first() {
    this.query = this.query.limit(1);
    return new Promise((resolve, reject) => {
      this.query.then(result => {
        if (result.length) resolve(new this.model(result[0]));
        else resolve(null);
      })
      .catch(reject);
    });
  }

  findBy(query) {
    return this.where(query).first;
  }

  then(fn) {
    return this.query.then(rows => {
      rows = rows.map(item => new this.model(item));
      return fn(rows);
    });
  }
}
