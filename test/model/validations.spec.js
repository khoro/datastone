import validations from '@model/validations';

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
});
