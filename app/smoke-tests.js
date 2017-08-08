const supertest = require("supertest");

function smokeTests(description, appOrUrl, pairs) {
  const request = supertest(appOrUrl);
  describe(description, () => {
    pairs.forEach(pair => {
      const uri = pair[0];
      const regex = pair[1];
      it(`should load${uri}`, done => {
        request.get(uri).expect(200).expect(regex).end(done);
      });
    });
  });
}

module.exports = smokeTests;
