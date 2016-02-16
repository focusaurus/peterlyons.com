var _ = require('lodash')
var moment = require('moment')

function presentPost (post) {
  var presented = _.clone(post)
  presented.title = presented.title.trim()
  presented.date = moment(post.publish_date).format('MMM DD, YYYY')
  return presented
}

module.exports = presentPost
