const request = require("./request");
const expect = require("chaimel");

const testConfigs = [
  ["/", /personal site/],
  ["/bands", /Afronauts/],
  ["/oberlin", /Edison/],
  ["/favorites", /Imogen/]
];

request.smoke(testConfigs);

const proNav = ["Code Conventions", "Career", "Projects"];
describe("the layout for personal site", () => {
  let body;
  before(done => {
    request.get("/").expect(200).end((error, res) => {
      body = res && res.text;
      done(error);
    });
  });
  proNav.forEach(page => {
    it(`should not include pro navigation${page}`, () => {
      expect(body).notToInclude(page);
    });
  });
});
