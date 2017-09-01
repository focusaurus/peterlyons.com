const {promisify} = require("util");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const childProcess = require("child_process");
const config = require("config3");
const fs = require("fs");
const httpErrors = require("httperrors");
const log = require("bole")(__filename);
const postStore = require("./post-store");
const promiseHandler = require("../promise-handler");

const readFileAsync = promisify(fs.readFile);
const compareAsync = promisify(bcrypt.compare);
const execFileAsync = promisify(childProcess.execFile);

async function verifyPasswordAsync(password, hash) {
  const correctPassword = await compareAsync(password, hash);
  if (!correctPassword) {
    throw new httpErrors.Forbidden("incorrect password");
  }
  return correctPassword;
}

async function newBlogPrepare() {
  const script = config.blog.newBlogPreparePath;
  try {
    const io = await execFileAsync(script, []);
    log.info(
      {
        stdout: io.stdout.toString(),
        stderr: io.stderr.toString()
      },
      "new blog prepare succeeded"
    );
  } catch (error) {
    log.error({err: error}, "Error preparing git repo for new blog");
    throw error;
  }
}

async function newBlogFinalize(password, post) {
  const script = config.blog.newBlogFinalizePath;
  try {
    const io = await execFileAsync(script, [password]);
    log.info(
      {
        stdout: io.stdout.toString(),
        stderr: io.stderr.toString()
      },
      "new blog finalized successfully"
    );
    return post;
  } catch (error) {
    log.error({err: error}, "Error finalizing git commit/push for new blog");
    throw error;
  }
}

async function createPost(req, res) {
  const password = req.body.password;
  const hash = await readFileAsync(config.blog.hashPath, "utf8");
  await verifyPasswordAsync(password, hash);
  await newBlogPrepare();
  const blog = req.app.locals.blog;
  const post = {
    title: req.body.title,
    content: `${(req.body.content || "").trim()}\n`
  };
  const metadataPath = await postStore.save(blog.basePath, post);
  await newBlogFinalize(password, post);
  const loadedPost = postStore.load(blog.prefix, metadataPath);
  res.send(loadedPost);
  res.app.locals.blog.load();
}

module.exports = {
  handler: [bodyParser.json(), promiseHandler(createPost)],
  verifyPasswordAsync
};
