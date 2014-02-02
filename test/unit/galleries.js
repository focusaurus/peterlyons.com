var assert = require("assert");
var galleries = require("app/photos/galleries");

var mockPhotoJSON = JSON.stringify([
  {
    name: "test-photo-name"
  }
]);

var gallery = {
  dirName: "testGallery"
};

describe("app/photos/galleries", function () {
  it("photoJSONToObject should parse and format JSON", function() {
    var photos = galleries.photoJSONToObject(gallery, mockPhotoJSON);
    assert.equal(photos.length, 1);
    assert.equal(
      photos[0].fullSizeURI, "/photos/testGallery/test-photo-name.jpg");
    assert.equal(
      photos[0].thumbnailURI, "/photos/testGallery/test-photo-name-TN.jpg");
    assert.equal(
      photos[0].pageURI,
      "/app/photos?gallery=testGallery&photo=test-photo-name"
    );
  });
});
