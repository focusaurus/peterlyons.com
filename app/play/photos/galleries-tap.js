"use strict";
const galleries = require("./galleries");
const tap = require("tap");

const mockPhotoJSON = JSON.stringify([
  {
    name: "test-photo-name"
  }
]);

const gallery = {
  dirName: "testGallery"
};

tap.test("photoJSONToObject should parse and format JSON", test => {
  const photos = galleries.photoJSONToObject(gallery, mockPhotoJSON);
  tap.same(photos.length, 1);
  tap.match(photos[0], {
    fullSizeURI: "/photos/testGallery/test-photo-name.jpg",
    thumbnailURI: "/photos/testGallery/test-photo-name-TN.jpg",
    pageURI: "/app/photos?gallery=testGallery&photo=test-photo-name"
  });
  test.end();
});
