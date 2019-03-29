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
    record.email = 'mail1@mail.com';

    await new UniquenessValidator(
      record,
      'email',
      'mail1@mail.com',
      true
    ).validate();

    expect(record.errors.messages.email).toEqual([UniquenessValidator.message]);
  });

  it('checks multiple scopes if provided', async () => {
    record.name = 'name2';

    await new UniquenessValidator(
      record,
      'email',
      'mail1@mail.com',
      { scope: 'name' }
    ).validate();

    expect(record.errors.messages.email).toEqual(undefined);

    record.name = 'name1';
    await new UniquenessValidator(
      record,
      'email',
      'mail1@mail.com',
      { scope: 'name' }
    ).validate();

    expect(record.errors.messages.email).toEqual([UniquenessValidator.message]);

    record = new User();
    record.name = 'name1';

    await new UniquenessValidator(
      record,
      'email',
      'mail1@mail.com',
      { scope: ['name', 'password'] }
    ).validate();

    expect(record.errors.messages.email).toEqual(undefined);

    record = new User();
    record.name = 'name1';
    record.password = 'pass1';

    await new UniquenessValidator(
      record,
      'email',
      'mail1@mail.com',
      { scope: ['name', 'password'] }
    ).validate();

    expect(record.errors.messages.email).toEqual([UniquenessValidator.message]);
  });

  it('skips if data not changed', async () => {
    record = await User.find(1);
    record.email = 'mail1@mail.com';

    await new UniquenessValidator(
      record,
      'email',
      'mail1@mail.com',
      true
    ).validate();

    expect(record.errors.messages.email).toEqual(undefined);

    record.email = 'mail1@mail.com';

    await new UniquenessValidator(
      record,
      'email',
      'mail1@mail.com',
      { scope: ['name', 'password'] }
    ).validate();

    expect(record.errors.messages.email).toEqual(undefined);

    record.email = 'mail2@mail.com';
    record.password = 'pass2';

    await new UniquenessValidator(
      record,
      'email',
      'mail2@mail.com',
      { scope: 'password' }
    ).validate();

    expect(record.errors.messages.email).toEqual([UniquenessValidator.message]);
  });
})
