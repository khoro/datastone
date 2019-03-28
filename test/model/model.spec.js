import Model from '@model/model';
import { dbConfig } from '../support/config';

describe('src/model/model', () => {
  describe('#register', () => {
    it('registers the models', () => {
      class Model1 extends Model {}
      class Model2 extends Model {}
      Model1.register();
      Model2.register();
      expect(Model.__models).toEqual({ Model1, Model2 });
    });
  });

  describe('#configure', () => {
    it('sets knex', async () => {
      await Model.configure(dbConfig);
      expect(Model.__knex).toBeTruthy();
    });
  });
});
