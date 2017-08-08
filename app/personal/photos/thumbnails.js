const pd = require("./prevent-default");
const React = require("react");

const RD = React.DOM;

function Thumbnails(props) {
  const thumbnails = props.gallery.photos.map(photo =>
    RD.a(
      {
        className: "thumbnail",
        href: photo.pageURI,
        key: photo.pageURI,
        onClick: pd(() => {
          props.viewPhoto(photo.name);
        })
      },
      RD.img({
        className: "thumbnail",
        src: photo.thumbnailURI,
        alt: photo.caption,
        title: photo.caption
      })
    )
  );
  return RD.div({className: "thumbnails"}, thumbnails);
}

module.exports = Thumbnails;
