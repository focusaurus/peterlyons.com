#Holy Upvotes, Batman! http://stackoverflow.com/a/901144/266795
#tweaked by plyons for testability
getParameterByName = (name, queryString) ->
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  queryString = queryString or location.search
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  results = regex.exec(queryString)
  (if not results? then "" else decodeURIComponent(results[1].replace(/\+/g, " ")))

galleryController = ($scope, $http, $routeParams, galleryName, photoName) ->

  $http.get("/galleries/#{galleryName}").success (galleryData) ->
    $scope.gallery = galleryData
    currentIndex = 0
    matchingPhoto = galleryData.photos.filter (photo) -> photo.name is photoName
    if matchingPhoto.length
      currentIndex = galleryData.photos.indexOf matchingPhoto[0]
    $scope.photo = galleryData.photos[currentIndex]
    # It is OK for these indices to cause
    # previousPhoto or nextPhoto to be undefined.
    $scope.nextPhoto = galleryData.photos[currentIndex + 1]
    $scope.previousPhoto = galleryData.photos[currentIndex - 1]

  $http.get("/galleries").success (galleries) ->
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

_photos = ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.otherwise
    controller: galleryController
    template: $(".galleryApp").html()

photosApp = angular.module "photos", ["ngRoute"], _photos
photosApp.value "galleryName", getParameterByName "gallery"
photosApp.value "photoName", getParameterByName "photo"
photosApp.controller("galleryController", galleryController)
