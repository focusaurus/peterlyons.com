"use strict";
const tap = require("tap");
const request = require("supertest");

(async () => {
  const server = await require("../test-server")();

  tap.test("/galleries/{slug}", test => {
    request(server.info.uri)
      .get("/galleries/summer_2001")
      .expect(200)
      .expect("content-type", "application/json; charset=utf-8")
      .end((error, res) => {
        test.error(error);
        test.match(res.body, {
          dirName: "summer_2001",
          displayName: "Summer 2001"
        });
        test.ok(Array.isArray(res.body.photos));
        test.match(res.body.photos[0], {
          caption: "Andrew, Ed, and Leslie on the dance floor",
          fullSizeURI: "/photos/summer_2001/ap_ep_lp_dance.jpg",
          name: "ap_ep_lp_dance",
          pageURI: "/app/photos?gallery=summer_2001&photo=ap_ep_lp_dance",
          thumbnailURI: "/photos/summer_2001/ap_ep_lp_dance-TN.jpg"
        });
        test.end();
      });
  });
})();
