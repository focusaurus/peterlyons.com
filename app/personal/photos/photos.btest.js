// const React = require("react");
// const PhotoGallery = require("./photo-gallery");
// const expect = require("chaimel");
// const galleries = require("./galleries-test");
// const enzyme = require("enzyme");
//
// describe("PhotoGallery", () => {
//   let wrapper;
//   before(() => {
//     const element = React.createElement(PhotoGallery, {
//       galleries,
//       gallery: galleries[0],
//       photo: galleries[0].photos[2]
//     });
//     wrapper = enzyme.mount(element);
//   });
//
//   it("should have the correct list of galleries", () => {
//     const gall2 = wrapper.find("a.gallerylink");
//     expect(gall2).toHaveLength(2);
//     expect(gall2.get(1).innerText).toEqual("Unit Test Gallery 2");
//   });
//
//   it("should have the correct thumbnails", () => {
//     const thumbnails = wrapper.find("a.thumbnail");
//     expect(thumbnails).toHaveLength(3);
//     expect(thumbnails.get(0).href).toInclude(
//       "/app/photos?gallery=burning_man_2011&photo=001_hexayurt_model"
//     );
//   });
// });
async function run(tab) {} // eslint-disable-line
exports.run = run;
exports.uri = "/photos";
