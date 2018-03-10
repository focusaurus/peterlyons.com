"use strict";
const autoprefixer = require("autoprefixer-stylus");
const fs = require("fs");
const nib = require("nib");
const path = require("path");
const rupture = require("rupture");
const stylus = require("stylus");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const screenDotStyl = path.join(__dirname, "screen.styl");
async function setup(server) {
  server.route({
    method: "GET",
    path: "/screen.css",
    handler: async (request, reply) => {
      const input = (await readFileAsync(screenDotStyl)).toString();
      const css = await new Promise((resolve, reject) => {
        stylus(input)
          .set("filename", screenDotStyl)
          .use(nib())
          .use(rupture())
          .use(autoprefixer())
          .render((err, output) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(output);
          });
      });
      return reply.response(css).type("text/css");
    }
  });
}
module.exports = setup;
