class NotFound extends Error
  constructor: (@name) ->
    super @name

module.exports = NotFound
