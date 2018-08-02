module.exports = {
  name: "redirects",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "GET",
      path: "/{page}.html",
      options: { cache: false },
      handler: (request, h) => h.redirect(`/${request.params.page}`).code(301)
    });
  }
};
