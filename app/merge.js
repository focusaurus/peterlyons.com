var _ = require('lodash')

// For use as a react component method
function merge (values) {
  var newState = _.extend({}, this.state, values)
  this.setState(newState)
  return this
}

module.exports = merge
