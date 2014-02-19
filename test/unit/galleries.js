var expectations = require("expectations");
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
    expect(photos.length).toBe(1);
    expect(
      photos[0].fullSizeURI).toBe("/photos/testGallery/test-photo-name.jpg");
    expect(
      photos[0].thumbnailURI).toBe("/photos/testGallery/test-photo-name-TN.jpg");
    expect(photos[0].pageURI).toBe(
      "/app/photos?gallery=testGallery&photo=test-photo-name");
  });
});
