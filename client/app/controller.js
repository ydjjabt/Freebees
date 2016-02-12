var app = angular.module('myApp', ['map.services'])

.controller('FormController', function($scope, $http, Posts, Map){
  $scope.user = {};
  $scope.sendPost = function(){
    //convert inputted address
    Map.geocodeAddress(geocoder, Map.map, $scope.user.location, function(converted) {
      Posts.saveToDB({item: $scope.user.item, location: converted});
    });
  };
  $scope.initMap = function(){
    Map.initMap();
  };
})
.factory('Posts', function($http){
  var saveToDB = function(toSave){
  var config = {headers: {'Content-Type':'application/x-www-form-urlencoded'}};
  $http.post('/', toSave, config)
    .then(function(data){
      console.log('successful post! ', data);
    }, function(err){
      console.log(err);
    });
  };
  return {
    saveToDB: saveToDB
  };
});
