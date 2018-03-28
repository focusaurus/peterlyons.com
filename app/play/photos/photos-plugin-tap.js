"use strict";
const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  const server = await require("./test-server")();
  uri = server.info.uri; // eslint-disable-line prefer-destructuring
});

tap.test("/photos should redirect to newest gallery", test => {
  request(uri)
    .get("/photos")
    .expect(302)
    .expect("location", "/photos?gallery=utg-2")
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/photos?gallery={slug} base case", test => {
  request(uri)
    .get("/photos?gallery=utg-2")
    .expect(200)
    .expect("content-type", "text/html; charset=utf-8")
    .expect(/<div class="view-gallery">/i)
    .expect(/<h1>/i)
    .expect(/window\.__sharifyData=/i)
    .expect(/002_unit_test/i)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/photos?gallery={slug} missing case redirect", test => {
  request(uri)
    .get("/photos?gallery=nope")
    .expect(302)
    .expect("location", "/photos?gallery=utg-2")
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/galleries/{slug}", test => {
  request(uri)
    .get("/galleries/utg-1")
    .expect(200)
    .expect("content-type", "application/json; charset=utf-8")
    .end((error, res) => {
      test.error(error);
      test.match(res.body, {
        dirName: "utg-1",
        displayName: "Unit Test Gallery 1"
      });
      test.ok(Array.isArray(res.body.photos));
      test.match(res.body.photos[0], {
        caption: "Unit Test 1",
        fullSizeURI: "/photos/utg-1/001_unit_test.jpg",
        name: "001_unit_test",
        pageURI: "/photos?gallery=utg-1&photo=001_unit_test",
        thumbnailURI: "/photos/utg-1/001_unit_test-TN.jpg"
      });
      test.end();
    });
});

tap.test("/galleries/{slug} missing gallery", test => {
  request(uri)
    .get("/galleries/nope")
    .expect(404)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/app/photos URL alias", test => {
  request(uri)
    .get("/app/photos?gallery=utg-2")
    .expect(200)
    .expect("content-type", "text/html; charset=utf-8")
    .expect(/<div class="view-gallery">/i)
    .expect(/<h1>/i)
    .expect(/window\.__sharifyData=/i)
    .expect(/002_unit_test/i)
    .end(error => {
      test.error(error);
      test.end();
    });
});
