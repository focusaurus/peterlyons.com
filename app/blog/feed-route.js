const postStore = require("./post-store");
const presentPost = require("./present-post");

function feed(req, res, next) {
  res.type("xml");
  const blog = res.app.locals.blog;
  if (blog.cachedFeedXML) {
    res.send(blog.cachedFeedXML);
    return;
  }

  Promise.all(blog.posts.slice(0, 10).map(postStore.loadContent))
    .then(loaded => {
      const locals = {
        pretty: true,
        posts: loaded.map(presentPost.asObject),
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
    })
    .catch(next);
}

module.exports = feed;
