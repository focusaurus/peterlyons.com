leadZero = (value) ->
  if value > 9 then "#{value}" else "0#{value}"
module.exports = leadZero
