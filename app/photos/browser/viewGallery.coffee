galleryController = ($scope, $http, galleryName) ->
  $http.get("/galleries/#{galleryName}").success (galleryData) ->
    $scope.gallery = galleryData
    currentIndex = 0
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


photosApp = angular.module("photos", [])
photosApp.value "galleryName", "burning_man_2011"
photosApp.controller("galleryController", galleryController)
