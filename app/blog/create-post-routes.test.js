const bcrypt = require("bcryptjs");
const createPost = require("./create-post-routes");
const expect = require("chaimel");
const testBlog = require("./test-blog");
const testUtils = require("../test-utils");

describe("createPost.verifyPasswordAsync", () => {
  const password = "unit test blog password";
  /* eslint-disable no-sync */
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  it("should callback without error with correct password", async () => {
    await createPost.verifyPasswordAsync(password, hash);
  });

  it("should throw exception with incorrect password", async () => {
    try {
      await createPost.verifyPasswordAsync(`${password}NOPE`, hash);
    } catch (error) {
      expect(error).toBeAnInstanceOf(Error);
    }
  });
});

describe("the blog post authoring/preview page", () => {
  let $ = null;
  before(async () => {
    await testBlog.load();
    $ = await testBlog.loadPage("/utb/post");
  });

  it("should have a preview section and a textarea", () => {
    testUtils.assertSelectors($, "section.preview", "textarea");
  });
});
