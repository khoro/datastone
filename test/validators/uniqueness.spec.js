import { UniquenessValidator } from '@validators';
import { Model } from '../../src';
import createKnex from 'knex';
import { dbConfig } from '../support/config';
import { seedData } from '../support/seed';

class User extends Model {}
User.register();

describe('src/validators/unqiueness', () => {
  let record;

  beforeAll(async () => {
    Model.__knex = createKnex(dbConfig);
    await seedData(Model.__knex);
    await Model.__loadModels();
  });

  afterAll(() => {
    Model.__knex.destroy();
  });

  beforeEach(() => {
    record = new User();
  });

  it('adds error if record exists', async () => {
    await new UniquenessValidator(record, 'email', 'mail1@mail.com', true).validate();
    expect(record.errors.messages.email).toEqual([UniquenessValidator.message]);
  });
})
