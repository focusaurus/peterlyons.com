const pd = require("./prevent-default");
const React = require("react");

const RD = React.DOM;

function links(props) {
  const returnLinks = [];
  if (props.previousPhoto) {
    const attrs = {
      href: props.previousPhoto.pageURI,
      onClick: pd(() => {
        props.viewPhoto(props.previousPhoto.name);
      }),
      key: "previous",
      dangerouslySetInnerHTML: {__html: "&larr;previous&nbsp;"}
    };
    returnLinks.push(RD.a(attrs));
  }

  if (props.nextPhoto) {
    const attrs2 = {
      href: props.nextPhoto.pageURI,
      onClick: pd(() => {
        props.viewPhoto(props.nextPhoto.name);
      }),
      key: "next",
      dangerouslySetInnerHTML: {__html: "next&rarr;"}
    };
    returnLinks.push(RD.a(attrs2));
  }
  return returnLinks;
}

function Photo(props) {
  const photo = props.photo;
  return RD.div(
    {className: "photo"},
    RD.div({id: "nextPrev"}, links(props)),
    RD.figure(
      null,
      RD.img({
        src: photo.fullSizeURI,
        alt: photo.caption,
        title: photo.caption
      }),
      RD.figcaption(null, photo.caption)
    )
  );
}

module.exports = Photo;
