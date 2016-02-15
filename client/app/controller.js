var app = angular.module('myApp', ['map.services'])

.controller('FormController', function($scope, $http, Posts, Map){
  $scope.user = {};
  $scope.sendPost = function(){
    //convert inputted address
    Map.geocodeAddress(geocoder, Map.map, $scope.user.location, function(converted) {
      Posts.saveToDB({item: $scope.user.item, LatLng: converted});
    });
  };
  $scope.initMap = function(){
    Map.initMap($scope.user.item);
  };
})
.factory('Posts', function($http, Map){
  var saveToDB = function(toSave){
  return $http.post('/', toSave)
    .then(function(data){
      console.log('successful post!');
      Map.addMarker(map, toSave);
    }, function(err){
      console.log(err);
    });
  };
  return {
    saveToDB: saveToDB
  };
});
