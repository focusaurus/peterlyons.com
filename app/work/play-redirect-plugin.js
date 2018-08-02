"use strict";

const paths = [
  "/app/photos",
  "/bands.html",
  "/bands",
  "/favorites.html",
  "/favorites",
  "/oberlin.html",
  "/oberlin",
  "/persblog",
  "/photos"
];
module.exports = {
  name: "personalRedirects",
  version: "1.0.0",
  async register(server) {
    paths.forEach(path => {
      server.route({
        method: "GET",
        path,
        options: { cache: false },
        handler: (request, h) =>
          h.redirect(`https://peterlyons.org${request.url.path}`).code(301)
      });
    });
  }
};
