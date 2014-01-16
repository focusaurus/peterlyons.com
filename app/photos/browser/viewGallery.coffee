class GalleryController
  constructor: (@$scope, @$window, @$location, @$anchorScroll, @$http, gallery, galleries) ->
    @$scope.gallery = gallery
    @$scope.galleryName = gallery.dirName
    byYear = {}
    for gallery in galleries
      year = gallery.startDate.split("-")[0]
      list = byYear[year]?= []
      list.push gallery
    years = []
    for year, galleries of byYear
      years.push {name: year, galleries}
    years.reverse()
    @$scope.years = years
    @changePhoto()
    @$scope.$watch "photoName", @changePhoto
    @$scope.$watch "galleryName", @changeGallery
    @$scope.$on "$locationChangeSuccess", @parseSearch
    angular.element(@$window).on("keyup", @onKeyup)

  parseSearch: =>
   havePhoto = @$location.search().photo?
   @$scope.galleryName = @$location.search().gallery
   @$scope.photoName = @$location.search().photo
   @$location.hash("photo") if havePhoto

  onKeyup: (event) =>
    switch event.keyCode
      when 37
        return if not @$scope.previousPhoto?
        @$scope.photoName = @$scope.previousPhoto.name
        @$scope.$digest()
      when 39
        return if not @$scope.nextPhoto?
        @$scope.photoName = @$scope.nextPhoto.name
        @$scope.$digest()

  changePhoto: =>
    currentIndex = 0
    matchingPhoto = @$scope.gallery.photos.filter (_p) => _p.name is @$scope.photoName
    if matchingPhoto.length
      currentIndex = @$scope.gallery.photos.indexOf matchingPhoto[0]
    @$scope.photo = @$scope.gallery.photos[currentIndex]
    # It is OK for these indices to cause
    # previousPhoto or nextPhoto to be undefined.
    @$scope.nextPhoto = @$scope.gallery.photos[currentIndex + 1]
    @$scope.previousPhoto = @$scope.gallery.photos[currentIndex - 1]

  changeGallery: =>
    # The data for the initial gallery comes bootstrapped as JSON within
    # the page HTML, so don't need an XHR to get the first gallery
    if not @firstLoadDone
      @firstLoadDone = true
      return
    @$http.get("/galleries/#{@$scope.galleryName}").success (galleryData) =>
      @$scope.gallery = galleryData
      @$window.document.title = galleryData.displayName + " Photo Gallery"
      @$scope.photoName = @$location.search().photo or @$scope.gallery.photos[0]?.name

_photos = ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.otherwise
    controller: GalleryController
    reloadOnSearch: false
photosApp = angular.module "photos", ["ngRoute"], _photos
photosApp.value("gallery", __sharifyData.gallery)
photosApp.value("galleries", __sharifyData.galleries)
photosApp.controller("GalleryController", GalleryController)

