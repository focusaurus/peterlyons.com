/* global window document */
const tag = require("escape-goat").escapeTag;

const pageState = {};

function dom(selector) {
  return document.querySelector(`.view-gallery ${selector}`);
}

function thumbnail(photo) {
  return tag`<a class="thumbnail" href="${photo.pageURI}">
  <img
    class="thumbnail"
    data-photo-name="${photo.name}"
    src="${photo.thumbnailURI}"
    alt="${photo.caption}" title="${photo.caption}">
  </a>`;
}

function thumbnails(photos) {
  return `<div class="thumbnails">
    ${photos.map(thumbnail).join("")}
    </div>`;
}

function previousNext(previousPhoto, nextPhoto) {
  /* eslint-disable no-ternary */
  return [
    '<div id="nextPrev">',
    previousPhoto
      ? tag`<a href="${previousPhoto.pageURI}" data-photo-name="${previousPhoto.name}">&larr;previous&nbsp;</a>`
      : "",
    nextPhoto
      ? tag`<a href="${nextPhoto.pageURI}" data-photo-name="${nextPhoto.name}">next&rarr;</a>`
      : "",
    "</div>"
  ].join("");
  /* eslint-enable no-ternary */
}

function fullSize(state) {
  const {photo, previousPhoto, nextPhoto} = state;
  return [
    '<div class="photo">',
    `<h1 id="photo">${state.gallery.displayName}</h1>`,
    previousNext(previousPhoto, nextPhoto),
    tag`<figure>
      <img src="${photo.fullSizeURI}" alt="${photo.caption}" title="${photo.caption}">
      <figcaption>${photo.caption}</figcaption>
    </figure>
  </div>`
  ].join("");
}

function galleryLinks(year) {
  return year.galleries
    .map(
      gallery =>
        `<a class="galleryLink" href="?gallery=${encodeURIComponent(
          gallery.dirName
        )}" data-dir-name="${gallery.dirName}">${gallery.displayName}</a>`
    )
    .join("");
}

function getYears(galleries) {
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

function galleryList(galleries) {
  const years = getYears(galleries);
  const yearNodes = years
    .map(
      year =>
        `<div>
      <h2 class="year">${year.name}</h2>
    ${galleryLinks(year)}
    </div>`
    )
    .join("");
  return `<nav class="photos">${yearNodes}</nav>`;
}

function renderFullSize(state) {
  dom(".photo").innerHTML = fullSize(state);
}

function render(state) {
  document.querySelector(".view-gallery").innerHTML = `
    ${fullSize(state)}
    ${thumbnails(state.gallery.photos)}
    ${galleryList(state.galleries)}`;
  // eslint-disable-next-line no-use-before-define
  document.querySelector("nav.photos").addEventListener("click", viewGallery);
}

function navigate(state) {
  window.document.title = `${state.gallery.displayName} Photo Gallery`;
  const newUrl = `${window.location.pathname}?gallery=${encodeURIComponent(
    state.gallery.dirName
  )}&photo=${encodeURIComponent(state.photo.name)}#photo`;
  window.history.pushState(this.state, window.document.title, newUrl);
  window.document.getElementById("photo").scrollIntoView();
}

function setState(changes) {
  Object.assign(pageState, changes);
  if (changes.gallery && !changes.photo) {
    pageState.photo = pageState.gallery.photos[0];
  }
  const photos = pageState.gallery.photos;
  const index = photos.findIndex(photo => photo.name === pageState.photo.name);
  Object.assign(pageState, {
    previousPhoto: photos[index - 1],
    nextPhoto: photos[index + 1]
  });
  if (changes.gallery) {
    render(pageState);
  } else {
    renderFullSize(pageState);
  }
  navigate(pageState);
}

function viewPhoto(event) {
  event.preventDefault();
  const photoName = event.target.getAttribute("data-photo-name");
  if (!photoName) {
    return;
  }
  const photos = pageState.gallery.photos;
  setState({photo: photos.find(photo => photo.name === photoName)});
}

function viewGallery(event) {
  if (event.target.tagName !== "A") {
    return;
  }
  event.preventDefault();
  const dirName = event.target.getAttribute("data-dir-name");
  window
    .fetch(`/galleries/${dirName}`)
    .then(res => res.json())
    .then(gallery => {
      setState({gallery});
    })
    // eslint-disable-next-line no-console
    .catch(console.warn);
}

function arrowKeys(state, event) {
  switch (event.key) {
    case "ArrowRight":
      if (state.nextPhoto) {
        setState({photo: state.nextPhoto});
      }
      break;
    case "ArrowLeft":
      if (state.previousPhoto) {
        setState({photo: state.previousPhoto});
      }
      break;
    // no default
  }
}

function init() {
  setState(require("sharify").data);
  document.addEventListener("keydown", arrowKeys.bind(null, pageState));
  document.querySelector(".view-gallery").addEventListener("click", viewPhoto);
}
module.exports = init;
