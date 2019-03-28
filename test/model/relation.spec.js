import Model from '@model/model';
import createKnex from 'knex';
import { dbConfig } from '../support/config';
import { seedData } from '../support/seed';

class User extends Model {}
class Project extends Model {}
class Tag extends Model {}

User.register();
Project.register();
Tag.register();

describe('src/model/relation', () => {
  beforeAll(async () => {
    Model.__knex = createKnex(dbConfig);
    await seedData(Model.__knex);
    await Model.__loadModels();
  });

  afterAll(() => {
    Model.__knex.destroy();
  });

  it('returns correct model', async () => {
    expect((await User.all)[0] instanceof User).toBe(true);
  });

  describe('#all', () => {
    it('returns all the data', async () => {
      expect((await User.all).length).toEqual(5);
    });
  });

  describe('#none', () => {
    it('returns no data', async () => {
      expect((await User.none).length).toEqual(0);
    });
  });

  describe('#count', () => {
    it('returns data count', async () => {
      expect(await User.count()).toEqual(5);
    });
  });

  describe('#sum', () => {
    it('returns data sum', async () => {
      expect(await User.sum('balance')).toEqual(17.5);
    });
  });

  describe('#where', () => {
    it('returns conditional data', async () => {
      const records = await User.where({ isActive: true });
      expect(records.map(i => i.id)).toEqual([1, 2, 4]);
    });

    it('allows string query', async () => {
      const records = await User.where('"isActive" = ? AND balance > 2', true);
      expect(records.map(i => i.id)).toEqual([2, 4]);
    });
  });

  describe('#first', () => {
    it('returns the first record', async () => {
      const user = await User.first;
      expect(user.id).toBe(1);
    });

    it('returns null if no data', async () => {
      const user = await User.where('1 = 2').first;
      expect(user).toBe(null);
    });
  });

  describe('#last', () => {
    it('returns the last record', async () => {
      const user = await User.last;
      expect(user.id).toBe(5);
    });

    it('returns null if no data', async () => {
      const user = await User.where('1 = 2').last;
      expect(user).toBe(null);
    });
  });

  describe('#findBy', () => {
    it('returns the correct record', async () => {
      const user = await User.findBy({ name: 'name3' });
      expect(user.id).toBe(3);
    });
  });

  describe('#find', () => {
    it('returns the correct record', async () => {
      const user = await User.find(3);
      expect(user.name).toBe('name3');
    });
  });

  describe('#then', () => {
    it('builds the model instance correctly', async () => {
      const users = await User.all;
      expect(users[0].id).toBe(1);
      expect(users[0].email).toBe('mail1@mail.com');
      expect(users[0].password).toBe('pass1');
      expect(users[0].name).toBe('name1');
      expect(users[0].bio).toBe('bio1');
      expect(users[0].balance).toBe(1.5);
      expect(users[0].isActive).toBe(true);
      // TODO: DateTime issue for sqlite
    });
  });
});
