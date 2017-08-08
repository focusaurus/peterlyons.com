const presentPost = require("./present-post");

function feed(req, res, next) {
  const blog = res.app.locals.blog;
  res.type("xml");
  if (blog.cachedFeedXML) {
    res.send(blog.cachedFeedXML);
    return;
  }
  const posts = blog.posts.slice(0, 10).map(presentPost);
  const locals = {
    pretty: true,
    posts,
    hostname: req.hostname
  };
  res.app.render("blog/feed", locals, (error, feedXML) => {
    if (error) {
      next(error);
      return;
    }
    blog.cachedFeedXML = feedXML;
    res.send(feedXML);
  });
}

module.exports = feed;
