galleryController = ($scope, $http, galleryName) ->
  $http.get("/galleries/#{galleryName}").success (galleryData) ->
    $scope.gallery = galleryData
    currentIndex = 0
    $scope.photo = galleryData.photos[currentIndex]
    # It is OK for these indices to cause
    # previousPhoto or nextPhoto to be undefined.
    $scope.nextPhoto = galleryData.photos[currentIndex + 1]
    $scope.previousPhoto = galleryData.photos[currentIndex - 1]

makeGalleryResource = ($resource) ->
  console.log "@bug makeGalleryResource running"
  $resource "/galleries/:name", null, {get: {method: "GET"}}

photosApp = angular.module("photos", [])
photosApp.factory "Gallery", makeGalleryResource
photosApp.value "galleryName", "burning_man_2011"
photosApp.controller("galleryController", galleryController)
