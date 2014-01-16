class GalleryController
  constructor: (@$scope, @$location, @$anchorScroll, @$http, galleries) ->
    @$scope.$watch "photoName", @changePhoto
    @$scope.$watch "galleryName", @changeGallery
    @$scope.$on "$locationChangeSuccess", @parseSearch
    @parseSearch()
    byYear = {}
    for gallery in galleries
      year = gallery.startDate.split("-")[0]
      list = byYear[year]?= []
      list.push gallery
    years = []
    for year, galleries of byYear
      years.push {name: year, galleries}
    years.reverse()
    $scope.years = years

  parseSearch: =>
   @$scope.galleryName = @$location.search().gallery
   @$scope.photoName = @$location.search().photo
   @$location.hash("photo")

  changePhoto: =>
    if not @$scope.gallery?.photos?
      return
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
    @$http.get("/galleries/#{@$scope.galleryName}").success (galleryData) =>
      @$scope.gallery = galleryData
      @$scope.photoName = @$location.search().photo or @$scope.gallery.photos[0]?.name
      @changePhoto @$scope

_photos = ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.otherwise
    controller: GalleryController
    reloadOnSearch: false
photosApp = angular.module "photos", ["ngRoute"], _photos
photosApp.value("galleries", __sharifyData.galleries)
photosApp.controller("GalleryController", GalleryController)
