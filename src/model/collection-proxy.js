export default class CollectionProxy extends Array {
  where(...args) {
    return this.query.where(...args);
  }

  async then(fn) {
    const result = await this.query;
    result.forEach(item => this.push(item));
    fn([...this]);
  }
}
