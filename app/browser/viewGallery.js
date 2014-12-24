function GalleryController(
    $scope, $window, $location, $anchorScroll, $http, gallery, galleries) {
  this.$scope = $scope;
  this.$window = $window;
  this.$location = $location;
  this.$anchorScroll = $anchorScroll;
  this.$http = $http;
  this.changeGallery = this.changeGallery.bind(this);
  this.changePhoto = this.changePhoto.bind(this);
  this.onKeyup = this.onKeyup.bind(this);
  this.parseSearch = this.parseSearch.bind(this);
  this.$scope.gallery = gallery;
  this.$scope.galleryName = gallery.dirName;
  var byYear = {};
  galleries.forEach(function(gallery) {
    var year = gallery.startDate.split("-")[0];
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(gallery);
  });


  var years = [];
  for (var year2 in byYear) {
    galleries = byYear[year2];
    years.push({
      name: year2,
      galleries: galleries
    });
  }
  years.reverse();
  this.$scope.years = years;
  this.changePhoto();
  this.$scope.$watch("photoName", this.changePhoto);
  this.$scope.$watch("galleryName", this.changeGallery);
  this.$scope.$on("$locationChangeSuccess", this.parseSearch);
  angular.element(this.$window).on("keyup", this.onKeyup);
}

GalleryController.prototype.parseSearch = function() {
  this.$scope.galleryName = this.$location.search().gallery;
  this.$scope.photoName = this.$location.search().photo;
  if (this.$scope.photoName !== null) {
    this.$location.hash("photo");
  }
};

GalleryController.prototype.onKeyup = function(event) {
  switch (event.keyCode) {
    case 37:
      if (this.$scope.previousPhoto === null) {
        return;
      }
      this.$location.search("photo", this.$scope.previousPhoto.name);
      break;
    case 39:
      if (this.$scope.nextPhoto === null) {
        return;
      }
      this.$location.search("photo", this.$scope.nextPhoto.name);
      break;
    default:
      return;
  }
  this.$scope.$apply(this.parseSearch());
};

GalleryController.prototype.changePhoto = function() {
  var self = this;
  var currentIndex = 0;
  var matchingPhoto = this.$scope.gallery.photos.filter(function(_p) {
    return _p.name === self.$scope.photoName;
  });
  if (matchingPhoto.length) {
    currentIndex = this.$scope.gallery.photos.indexOf(matchingPhoto[0]);
  }
  this.$scope.photo = this.$scope.gallery.photos[currentIndex];
  this.$scope.nextPhoto = this.$scope.gallery.photos[currentIndex + 1];
  this.$scope.previousPhoto = this.$scope.gallery.photos[currentIndex - 1];
};

GalleryController.prototype.changeGallery = function() {
  var self = this;
  if (!this.firstLoadDone) {
    this.firstLoadDone = true;
    return;
  }
  this.$http.get("/galleries/" + this.$scope.galleryName)
    .success(function(galleryData) {
    self.$scope.gallery = galleryData;
    self.$window.document.title = galleryData.displayName + " Photo Gallery";
    var firstPhoto = self.$scope.gallery.photos[0];
    var firstPhotoName = firstPhoto ? firstPhoto.name : null;
    self.$scope.photoName = self.$location.search().photo || firstPhotoName;
  });
};

var _photos = function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $routeProvider.otherwise({
    controller: GalleryController,
    reloadOnSearch: false
  });
};

function init() {
  //Just require angular without assigning it.
  //browserify returns an empty object, but window.angular is there
  require("angular");
  require("angular-route");
  var photosApp = angular.module("photos", ["ngRoute"], _photos);
  /* global __sharifyData */
  photosApp.value("gallery", __sharifyData.gallery);
  photosApp.value("galleries", __sharifyData.galleries);
  photosApp.controller("GalleryController", GalleryController);
}

module.exports = {
  GalleryController: GalleryController,
  init: init
};
