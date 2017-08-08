const _ = require("lodash");
const async = require("async");
const middleware = require("./middleware");

function feedRenderPost(req, res, post, callback) {
  const fakeRes = {
    post,
    contentPath: post.contentPath(),
    locals: _.cloneDeep(res.locals)
  };
  async.applyEachSeries(
    [
      middleware.html,
      middleware.markdownToHTML,
      middleware.domify,
      middleware.flickr,
      middleware.youtube,
      middleware.undomify,
      function storeContent(req2, fakeRes2, next) {
        // eslint-disable-next-line no-param-reassign
        fakeRes2.post.content = fakeRes2.html;
        next();
      }
    ],
    req,
    fakeRes,
    error => {
      if (error) {
        callback(error);
        return;
      }
      callback(null, post);
    }
  );
}

function feed(req, res, next) {
  const blog = res.app.locals.blog;
  res.type("xml");
  if (blog.cachedFeedXML) {
    res.send(blog.cachedFeedXML);
    return;
  }
  const recentPosts = blog.posts.slice(0, 10);
  const boundRender = feedRenderPost.bind(null, req, res);
  async.map(recentPosts, boundRender, (error, renderedPosts) => {
    if (error) {
      next(error);
      return;
    }
    const locals = {
      pretty: true,
      posts: renderedPosts,
      hostname: req.hostname
    };
    res.app.render("blog/feed", locals, (error2, feedXML) => {
      if (error2) {
        next(error2);
        return;
      }
      blog.cachedFeedXML = feedXML;
      res.send(feedXML);
    });
  });
}

module.exports = feed;
