function promiseHandler(handler) {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}

module.exports = promiseHandler;
