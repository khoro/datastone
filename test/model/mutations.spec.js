import Model from '@model/model';
import createKnex from 'knex';
import { dbConfig } from '../support/config';
import { seedData } from '../support/seed';
import faker from 'faker';

class User extends Model {}
class Project extends Model {}

User.register();
Project.register();

const userFactory = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.name.findName(),
  bio: faker.lorem.sentence(),
  balance: faker.finance.amount(),
  isActive: faker.random.boolean()
});

describe('src/model/mutations', () => {
  beforeAll(async () => {
    Model.__knex = createKnex(dbConfig);
    await seedData(Model.__knex);
    await Model.__loadModels();
  });

  afterAll(() => {
    Model.__knex.destroy();
  });

  describe('#save', () => {
    describe('new record', () => {
      it('creates new row', async () => {
        const user = new User(userFactory());
        await user.save();
        const lastUser = await User.last;
        expect(user.id).toEqual(6);
        expect(user.attributes).toEqual(lastUser.attributes);
      });

      it('triggers beforeSave, beforeCreate, afterSave, afterCreate hooks', async () => {
        const cb1 = asyncSpy();
        const cb2 = asyncSpy();
        const cb3 = asyncSpy();
        const cb4 = asyncSpy();
        User.beforeSave(cb1);
        User.beforeCreate(cb2);
        User.afterSave(cb3);
        User.afterCreate(cb4);
        await new User(userFactory()).save();
        expect(cb1.called).toBe(true);
        expect(cb2.called).toBe(true);
        expect(cb3.called).toBe(true);
        expect(cb4.called).toBe(true);
      });
    });

    describe('existing record', () => {
      it('updates the changes', async () => {
        const user = await User.find(1);
        user.name = 'changed';
        await user.save();
        expect((await User.find(1)).name).toBe('changed');
      });

      it('triggers beforeSave, beforeUpdate, afterSave, afterUpdate hooks', async () => {
        const cb1 = asyncSpy();
        const cb2 = asyncSpy();
        const cb3 = asyncSpy();
        const cb4 = asyncSpy();
        User.beforeSave(cb1);
        User.beforeUpdate(cb2);
        User.afterSave(cb3);
        User.afterUpdate(cb4);
        await (await User.find(1)).save();
        expect(cb1.called).toBe(true);
        expect(cb2.called).toBe(true);
        expect(cb3.called).toBe(true);
        expect(cb4.called).toBe(true);
      });
    });
  });

  describe('destroy', () => {
    it('deletes the record', async () => {
      const user = await User.find(1);
      await user.destroy();
      expect(await User.find(1)).toBe(null);
    });

    it('triggers beforeDestroy and afterDestroy hooks', async () => {
      const cb1 = asyncSpy();
      const cb2 = asyncSpy();
      User.beforeDestroy(cb1);
      User.afterDestroy(cb2);
      await (await User.find(2)).destroy();
      expect(cb1.called).toBe(true);
      expect(cb2.called).toBe(true);
    });
  });
});
