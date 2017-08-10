const {promisify} = require("util");
const dateFns = require("date-fns");
const fs = require("fs");
const mkdirpAsync = promisify(require("mkdirp"));
const path = require("path");
const slug = require("./slug");

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const DEFAULT_FORMAT = "md";

function contentPath(post) {
  const noExt = post.metadataPath.substr(0, post.metadataPath.lastIndexOf("."));
  return `${noExt}.${post.format || DEFAULT_FORMAT}`;
}

async function save(basePath, post) {
  const metadata = {
    format: post.format || DEFAULT_FORMAT,
    name: slug(post.title),
    publish_date: post.publish_date || new Date(),
    title: post.title
  };
  const metadataPath = path.join(
    basePath,
    dateFns.format(metadata.publish_date, "YYYY"),
    dateFns.format(metadata.publish_date, "MM"),
    `${metadata.name}.json`
  );
  await mkdirpAsync(path.dirname(metadataPath));

  return Promise.all([
    writeFileAsync(
      contentPath({metadataPath, format: post.format}),
      post.content
    ),
    writeFileAsync(metadataPath, JSON.stringify(metadata, null, 2))
  ]).then(() => metadataPath);
}
exports.save = save;

async function load(prefix, metadataPath) {
  const post = {
    metadataPath,
    format: DEFAULT_FORMAT
  };
  const jsonString = await readFileAsync(metadataPath, "utf8");
  const metadata = JSON.parse(jsonString);
  Object.assign(post, metadata);
  post.publish_date = new Date(post.publish_date);
  post.dirPath = path.dirname(metadataPath);
  post.monthPath = dateFns.format(post.publish_date, "YYYY/MM");
  post.uri = `${prefix}/${post.monthPath}/${post.name}`;
  post.contentPath = contentPath(post);
  post.content = await readFileAsync(post.contentPath, "utf8");
  return post;
}
exports.load = load;
