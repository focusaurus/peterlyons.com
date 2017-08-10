function feed(req, res, next) {
  res.type("xml");
  const blog = res.app.locals.blog;
  if (blog.cachedFeedXML) {
    res.send(blog.cachedFeedXML);
    return;
  }
  const locals = {
    pretty: true,
    posts: blog.posts.slice(0, 10),
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
