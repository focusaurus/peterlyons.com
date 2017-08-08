const _ = require("lodash");
const moment = require("moment");

function presentPost(post) {
  const presented = _.clone(post);
  presented.title = presented.title.trim();
  presented.date = moment(post.publish_date).format("MMM DD, YYYY");
  return presented;
}

module.exports = presentPost;
