const expect = require("chaimel");
const galleries = require("./galleries");

const mockPhotoJSON = JSON.stringify([
  {
    name: "test-photo-name"
  }
]);

const gallery = {
  dirName: "testGallery"
};

describe("app/photos/galleries", () => {
  it("photoJSONToObject should parse and format JSON", () => {
    const photos = galleries.photoJSONToObject(gallery, mockPhotoJSON);
    expect(photos.length).toEqual(1);
    expect(photos[0].fullSizeURI).toEqual(
      "/photos/testGallery/test-photo-name.jpg"
    );
    expect(photos[0].thumbnailURI).toEqual(
      "/photos/testGallery/test-photo-name-TN.jpg"
    );
    expect(photos[0].pageURI).toEqual(
      "/app/photos?gallery=testGallery&photo=test-photo-name"
    );
  });
});
