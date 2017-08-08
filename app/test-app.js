const expect = require("chaimel");
const cheerio = require("cheerio");
const supertest = require("supertest");

function testApp(app) {
  const request = supertest(app);
  function loadPage(URL, callback) {
    request.get(URL).expect(200).end((error, res) => {
      if (error) {
        callback(error);
        return;
      }
      const $ = cheerio.load(res.text);
      callback(null, $);
    });
  }

  function get(URL) {
    return request.get(URL);
  }

  function post(URL) {
    return request.post(URL);
  }

  /* eslint no-unused-vars:0 */
  function pageContains(...phrases /* _url, _phraseVarArgs, _done */) {
    const url = phrases.shift();
    const done = phrases.pop();

    request.get(url).expect(200).end((error, res) => {
      if (error) {
        done(error);
        return;
      }
      phrases.forEach(phrase => {
        if (typeof phrase === "string") {
          expect(res.text).toInclude(
            phrase,
            `Document missing phrase ${phrase}${res.text}`
          );
        } else {
          // regex
          expect(res.text).toMatch(
            phrase,
            `Document does not match ${phrase.pattern}`
          );
        }
      });
      done(null, cheerio.load(res.text));
    });
  }

  function smoke(testConfigs) {
    describe("smoke tests for most pages on the site", () => {
      testConfigs.forEach(testConfig => {
        const URI = testConfig[0];
        const regex = testConfig[1];
        it(`${URI} should match ${regex}`, done => {
          pageContains(URI, regex, done);
        });
      });
      it("should have a 404 page", done => {
        get("/should-cause-a-404").expect(404).end(done);
      });
    });
  }

  return {
    get,
    post,
    loadPage,
    pageContains,
    smoke
  };
}

module.exports = testApp;
