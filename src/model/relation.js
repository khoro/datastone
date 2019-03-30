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
        resolve(Number(Object.values(result[0])[0]));
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

  get last() {
    this.query = this.query.limit(1).orderBy('id', 'desc');
    return new Promise((resolve, reject) => {
      this.query.then(result => {
        if (result.length) resolve(new this.model(result[0]));
        else resolve(null);
      })
      .catch(reject);
    });
  }

  find(id) {
    return this.findBy({ id });
  }

  findBy(query) {
    return this.where(query).first;
  }

  limit(count) {
    this.query = this.query.limit(count);
    return this;
  }

  offset(count) {
    this.query = this.query.offset(count);
    return this;
  }

  order(query) {
    if (_.isPlainObject(query)) {
      const orderQuery = [];
      _.each(query, (order, column) => orderQuery.push({ column, order }));
      this.query = this.query.orderBy(orderQuery);
    } else {
      this.query = this.query.orderByRaw(query);
    }

    return this;
  }

  then(fn) {
    return this.query.then(rows => {
      rows = rows.map(item => new this.model(item));
      return fn(rows);
    });
  }
}
