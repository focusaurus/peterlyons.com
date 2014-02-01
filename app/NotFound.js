var util = require("util");

function NotFound() {
  Error.apply(this, arguments);
}
util.inherits(NotFound, Error);

module.exports = NotFound;
