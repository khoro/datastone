import validations from '@model/validations';
import Validator from '@validators/validator';

describe('src/model/validations', () => {
  describe('inheritance', () => {
    it('has own hooks only', () => {
      const ValModel = validations(class {});
      class ValModel1 extends ValModel {};
      class ValModel2 extends ValModel {};

      expect(ValModel1.validations).not.toBe(ValModel2.validations);
    });
  });

  describe('.registerValidator', () => {
    it('adds the validator to the validators list', () => {
      const Model = validations(class {});
      class MyValidator {};
      class AnotherCoolValidator {};

      Model.registerValidator(MyValidator);
      Model.registerValidator(AnotherCoolValidator);

      expect(Model.validators['my']).toBe(MyValidator);
      expect(Model.validators['anotherCool']).toBe(AnotherCoolValidator);
    });
  });

  describe('#validates', () => {
    it('adds the validations correctly', () => {
      const Model = validations(class {});
      class MyModel extends Model {};
      MyModel.validates('field1', { val1: true });
      MyModel.validates('field2', { val2: { inner: true } });
      expect(MyModel.validations).toEqual([
        { field: 'field1', validations: { val1: true } },
        { field: 'field2', validations: { val2: { inner: true } } }
      ]);
    });
  });

  describe('#isValid', () => {
    it('runs all the validations sync', async () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      const results = [];

      class MockValidator extends Validator {
        async validate() {
          await new Promise(resolve => {
            setTimeout(() => {
              cb1(this);
              results.push(1);
              resolve();
            }, 100);
          });
        }
      }

      class AnotherMockValidator extends Validator {
        validate() {
          results.push(2);
          cb2(this);
        }
      }

      const Model = validations(class {});
      Model.registerValidator(MockValidator);
      Model.registerValidator(AnotherMockValidator);
      class MyModel extends Model {};
      MyModel.validates('name', { mock: true });
      MyModel.validates('name', { anotherMock: true });
      const record = new MyModel();
      record.name = 'say my name';

      expect(await record.isValid).toBe(true);
      expect(results).toEqual([1, 2]);
      expect(cb1.mock.calls[0][0].field).toEqual('name');
      expect(cb1.mock.calls[0][0].model).toEqual(MyModel);
      expect(cb1.mock.calls[0][0].record).toEqual(record);
      expect(cb1.mock.calls[0][0].rule).toEqual(true);
      expect(cb1.mock.calls[0][0].value).toEqual('say my name');
    });
  });
});
