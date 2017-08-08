const Blog = require("./");
const cheerio = require("cheerio");
const express = require("express");
const join = require("path").join;
const supertest = require("supertest");

const app = express();
const blog = new Blog({
  basePath: join(__dirname, "unit-test-blog1"),
  staticPath: join(__dirname, "unit-test-blog1"),
  title: "Unit Test Blog 1",
  prefix: "/utb",
  subtitle: "Unit Test Subtitle 1"
});
// crap coupling here. Sorry.
blog.app.locals.analytics = {
  enabled: false
};
blog.app.locals.titleSuffix = "Unit Test Title Suffix";

app.use("/utb", blog.app);
// eslint-disable-next-line no-unused-vars
blog.app.use((error, req, res, next) => {
  res.status(error.statusCode).send(error.message);
});
const request = supertest(app);

blog.loadPage = async function loadPage(uri) {
  return request.get(uri).expect(200).then(res => cheerio.load(res.text));
};
blog.request = request;

module.exports = blog;
