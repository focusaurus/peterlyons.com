const errors = require("httperrors");
const path = require("path");
const postStore = require("./post-store");
const presentPost = require("./present-post");
const promiseHandler = require("../promise-handler");

async function viewPost(req, res, next) {
  debugger
  const blog = res.app.locals.blog;
  const metadataPath = path.join(blog.basePath, `${req.path}.json`);
  let post
  try {
    post = await postStore.load(blog.prefix, metadataPath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      next(new errors.NotFound(req.path));
      return;
    }
    next(error);
    return;
  }
  res.locals.post = presentPost.asObject(post);
  blog.assignNextPrevious(res.locals.post);
  res.render("blog/view-post");
}

module.exports = promiseHandler(viewPost);
