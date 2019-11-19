import { Model } from '@src';
import createKnex from 'knex';
import { dbConfig } from '../support/config';
import { seedData } from '../support/seed';

class User extends Model {}
class Address extends Model {}
class Project extends Model {}
class Tag extends Model {}

User.hasOne('address');
User.hasMany('projects');
Address.belongsTo('user');
Project.belongsTo('user');

User.register();
Address.register();
Project.register();
Tag.register();

describe('src/model/associations', () => {
  beforeAll(async () => {
    Model.__knex = createKnex(dbConfig);
    await seedData(Model.__knex);
    await Model.__loadModels();
  });

  afterAll(() => {
    Model.disconnect();
  });

  describe('#hasOne', () => {
    it('fetches the related row', async () => {
      const user = await User.find(2);
      expect((await user.address).country).toBe('country2');
      expect(user.address.street).toBe('street2');
    });
  });

  describe('#belongsTo', () => {
    it('fetches the related row', async () => {
      const address = await Address.find(1);
      expect((await address.user).id).toBe(2);
      expect(address.user.name).toBe('name2');
    });
  });

  describe('#hasMany', () => {
    it('fetches related rows', async () => {
      const user = await User.find(3);
      expect((await user.projects)[1].name).toBe('project2');
      expect(user.projects[2].name).toBe('project3');
    });

    it('can add extra queries', async () => {
      const user = await User.find(3);
      expect((await user.projects.where('projects.id > 1')).length).toBe(2);
      expect(user.projects.length).toBe(0);
    });
  });
});
