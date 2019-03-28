global.asyncSpy = (options = {}) => {
  options = Object.assign({}, { timeout: 50 }, options);
  
  const fn = () => new Promise(resolve => {
    setTimeout(() => {
      fn.called = true;
      fn.finishedAt = new Date();
      resolve();
    }, options.timeout);
  });
  fn.called = false;
  return fn;
}
