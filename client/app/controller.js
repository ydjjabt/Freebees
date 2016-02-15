var app = angular.module('myApp', ['map.services'])

.controller('FormController', function($scope, $http, Posts, Map){
  $scope.user = {};
  $scope.sendPost = function(){
    //convert inputted address
    Map.geocodeAddress(geocoder, Map.map, $scope.user.location, function(converted) {
      Posts.saveToDB({item: $scope.user.item, LatLng: converted});
    });
  };
  $scope.filterMap = function() {
    var searchInput = $scope.search.input;
    Posts.filterDB(searchInput);
  };
  $scope.initMap = function(){
    Map.loadAllItems();
  };
})
.factory('Posts', function($http, Map){
  var saveToDB = function(toSave){
  return $http.post('/', toSave)
    .then(function(data){
      console.log('successful post!', data.data);
      Map.addMarker(map, data.data);
      //Map.loadAllItems();

    }, function(err){
      console.log(err);
    });
  };
  var filterDB = function(toFilterBy) {
    return $http.get('/api/items')
      .then(function(data) {
        //filter our returned db by the desired itemName
        var filtered = data.data.filter(function(item) {
          return item.itemName.indexOf(toFilterBy) > -1;
        });
        console.log('filtered db is: ', filtered);
        //re-initialize map with only these markers
        Map.initMap(filtered);
      }, function(err) {
        console.log("error in filtering", err);
      });
  };
  return {
    saveToDB: saveToDB,
    filterDB: filterDB
  };
});
