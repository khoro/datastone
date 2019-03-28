import hooks from '@model/hooks';

describe('src/model/hooks', () => {
  describe('inheritance', () => {
    it('has own hooks only', () => {
      const HooksModel = hooks(class {});
      class HooksModel1 extends HooksModel {};
      class HooksModel2 extends HooksModel {};

      expect(HooksModel1.hooks).not.toBe(HooksModel2.hooks);
    });
  });

  describe('#beforeCreate', () => {
    it('adds the function or the function name to the hook array', () => {
      const MyModel = hooks(class {});
      const myFn = jest.fn();
      MyModel.beforeCreate('testCreate');
      MyModel.beforeCreate(myFn);
      expect(MyModel.hooks.beforeCreate).toEqual(['testCreate', myFn]);
    });
  });

  describe('#beforeDestroy', () => {
    it('adds the function or the function name to the hook array', () => {
      const MyModel = hooks(class {});
      const myFn = jest.fn();
      MyModel.beforeDestroy('testDestroy');
      MyModel.beforeDestroy(myFn);
      expect(MyModel.hooks.beforeDestroy).toEqual(['testDestroy', myFn]);
    });
  });

  describe('#trigger', () => {
    let TriggerModel;

    beforeEach(() => {
      TriggerModel = hooks(class {});
    });

    it('triggers beforeCreate hook correctly', async () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      TriggerModel.beforeCreate(cb1);
      TriggerModel.beforeCreate(cb2);
      await new TriggerModel().trigger('beforeCreate');
      expect(cb1.mock.calls.length).toBe(1);
      expect(cb2.mock.calls.length).toBe(1);
    });

    it('triggers beforeDestroy hook correctly', async () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      TriggerModel.beforeCreate(cb1);
      TriggerModel.beforeDestroy(cb2);
      new TriggerModel().trigger('beforeDestroy');
      expect(cb1.mock.calls.length).toBe(0);
      expect(cb2.mock.calls.length).toBe(1);
    });

    it('triggers snyc for async functions', async () => {
      const cb1 = asyncSpy({ timeout: 100 });
      const cb2 = asyncSpy({ timeout: 1 });

      TriggerModel.beforeCreate(cb1);
      TriggerModel.beforeCreate(cb2);
      await new TriggerModel().trigger('beforeCreate');

      expect(cb1.called).toBe(true);
      expect(cb2.called).toBe(true);
      expect(cb1.finishedAt < cb2.finishedAt).toBe(true)
    });

    it('may trigger instance method', async () => {
      const cb = asyncSpy();
      TriggerModel.prototype.myCallback = () => cb();
      TriggerModel.beforeCreate('myCallback');
      await new TriggerModel().trigger('beforeCreate');
      expect(cb.called).toBe(true);
    });
  });
});
