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

      it('triggers beforeSave and beforeCreate hooks', async () => {
        const cb1 = jest.fn();
        const cb2 = jest.fn();
        User.beforeSave(cb1);
        User.beforeCreate(cb2);
        await new User(userFactory()).save();
        expect(cb1.mock.calls.length).toBe(1);
        expect(cb2.mock.calls.length).toBe(1);
      });
    });

    describe('existing record', () => {
      it('updates the changes', async () => {
        const user = await User.find(1);
        user.name = 'changed';
        await user.save();
        expect((await User.find(1)).name).toBe('changed');
      });

      it('triggers beforeSave and beforeUpdate hooks', async () => {
        const cb1 = jest.fn();
        const cb2 = jest.fn();
        User.beforeSave(cb1);
        User.beforeUpdate(cb2);
        await (await User.find(1)).save();
        expect(cb1.mock.calls.length).toBe(1);
        expect(cb2.mock.calls.length).toBe(1);
      });
    });
  });
});
