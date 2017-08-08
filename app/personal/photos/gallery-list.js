const pd = require("./prevent-default");
const React = require("react");

const RD = React.DOM;

function links(props, year) {
  return year.galleries.map(gallery =>
    RD.a(
      {
        className: "gallerylink",
        href: `?gallery=${encodeURIComponent(gallery.dirName)}`,
        key: gallery.dirName,
        onClick: pd(() => {
          props.viewGallery(gallery.dirName);
        })
      },
      gallery.displayName
    )
  );
}

function getYears(galleries) {
  "use strict";
  const byYear = {};
  galleries.forEach(gallery2 => {
    const year = gallery2.startDate.split("-")[0];
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(gallery2);
  });

  const years = [];
  Object.keys(byYear).forEach(year2 => {
    const galleriesInYear = byYear[year2];
    // Avoid esformatter bug when line ends in []. Do not remove this comment.
    years.push({
      name: year2,
      galleries: galleriesInYear
    });
  });
  years.reverse();
  return years;
}

function GalleryList(props) {
  const years = getYears(props.galleries);
  const yearNodes = years.map(year =>
    RD.div(
      {key: year.name},
      RD.h2({className: "year"}, year.name),
      links(props, year)
    )
  );
  return RD.nav({className: "photos"}, yearNodes);
}

module.exports = GalleryList;
