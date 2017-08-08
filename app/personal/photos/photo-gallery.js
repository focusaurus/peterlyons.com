const _ = require("lodash");
const GalleryList = require("./gallery-list");
const Photo = require("./photo");
const querystring = require("querystring");
const React = require("react");
const request = require("superagent");
const Thumbnails = require("./thumbnails");

const RD = React.DOM;
/* global window */

const PhotoGallery = React.createClass({
  getInitialState: function getInitialState() {
    return {
      gallery: this.props.gallery,
      galleries: this.props.galleries,
      photo: this.props.photo || this.props.gallery.photos[0]
    };
  },

  onKeyDown: function onKeyDown(event) {
    switch (event.code || event.keyCode) {
      case "ArrowRight":
      case 39:
        if (this.state.nextPhoto) {
          this.viewPhoto(this.state.nextPhoto.name);
        }
        break;
      case "ArrowLeft":
      case 37:
        if (this.state.previousPhoto) {
          this.viewPhoto(this.state.previousPhoto.name);
        }
        break;
      // no default
    }
  },

  render: function render() {
    const index = _.findIndex(this.state.gallery.photos, {
      name: this.state.photo.name
    });
    this.state.previousPhoto = this.state.gallery.photos[index - 1];
    this.state.nextPhoto = this.state.gallery.photos[index + 1];

    return RD.div(
      {className: "gallery-app"},
      RD.h1(
        {
          id: "photo"
        },
        this.state.gallery.displayName
      ),
      React.createElement(Photo, {
        photo: this.state.photo,
        previousPhoto: this.state.previousPhoto,
        nextPhoto: this.state.nextPhoto,
        viewPhoto: this.viewPhoto
      }),
      React.createElement(Thumbnails, {
        gallery: this.state.gallery,
        viewPhoto: this.viewPhoto
      }),
      React.createElement(GalleryList, {
        galleries: this.state.galleries,
        viewGallery: this.viewGallery
      })
    );
  },

  viewPhoto: function viewPhoto(photoName) {
    const match = {
      name: photoName
    };
    const photo = _.find(this.state.gallery.photos, match) || this.state.photo;
    this.setState({photo});
    setTimeout(this.navigate);
  },

  viewGallery: function viewGallery(galleryDirName) {
    const self = this;
    request(`/galleries/${galleryDirName}`).end((error, res) => {
      if (error) {
        console.error(error); // eslint-disable-line no-console
        return;
      }
      const gallery = res.body;
      self.setState({
        gallery,
        photo: gallery.photos[0]
      });
      self.navigate();
    });
  },

  navigate: function navigate() {
    window.document.title = `${this.state.gallery.displayName} Photo Gallery`;
    const query = {
      gallery: this.state.gallery.dirName,
      photo: this.state.photo.name
    };
    const newUrl = `${window.location.pathname}?${querystring.stringify(
      query
    )}#photo`;
    window.history.pushState(this.state, window.document.title, newUrl);
    window.document.getElementById("photo").scrollIntoView();
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
  },

  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  }
});

module.exports = PhotoGallery;
