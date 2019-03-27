import { PresenceValidator } from '@validators';
import validations from '@model/validations';

const TestModel = validations(class {});

describe('src/validators/presence-validator', () => {
  let record;

  beforeEach(() => {
    record = new TestModel();
  });

  it('adds error for null values', () => {
    new PresenceValidator(record, 'field', null, true).validate();
    expect(record.errors.messages.field).toEqual([PresenceValidator.message]);
  });

  it('adds error for undefined values', () => {
    new PresenceValidator(record, 'field', undefined, true).validate();
    expect(record.errors.messages.field).toEqual([PresenceValidator.message]);
  });

  it('adds error for empty string values', () => {
    new PresenceValidator(record, 'field', '', true).validate();
    expect(record.errors.messages.field).toEqual([PresenceValidator.message]);
  });

  it('not adds error for valid values', () => {
    new PresenceValidator(record, 'field', 'hello', true).validate();
    expect(record.errors.messages.field).toEqual(undefined);
  });

  it('not adds error if rule is false', () => {
    new PresenceValidator(record, 'field', null, false).validate();
    expect(record.errors.messages.field).toEqual(undefined);
  });
})
