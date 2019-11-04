import { FormatValidator } from '@validators';
import Model from '@model/model';

class TestModel extends Model { }

describe('src/validators/format', () => {
  let record;

  beforeEach(() => {
    record = new TestModel();
  });

  it('adds error if value not matches with regex', () => {
    new FormatValidator(record, 'field', 'invalid', { with: /test/i }).validate();
    expect(record.errors.messages.field).toEqual([FormatValidator.message]);
  });

  it('not add error if value matches with regex', () => {
    new FormatValidator(record, 'field', 'test', { with: /test/i }).validate();
    expect(record.errors.messages.field).toEqual(undefined);
  });

  it('adds error if value matches without regex', () => {
    new FormatValidator(record, 'field', 'valid', { without: /test/i }).validate();
    expect(record.errors.messages.field).toEqual(undefined);
  });

  it('not add error if value not matches without regex', () => {
    new FormatValidator(record, 'field', 'test', { without: /test/i }).validate();
    expect(record.errors.messages.field).toEqual([FormatValidator.message]);
  });
})
