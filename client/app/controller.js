var app = angular.module('myApp', ['map.services'])

.controller('FormController', function($scope, $http, DBActions, Map){
  $scope.user = {};

  $scope.sendPost = function(){
    //convert inputted address
    Map.geocodeAddress(geocoder, Map.map, $scope.user.location, function(converted) {
      //after address converted, save user input item and location to db
      DBActions.saveToDB({item: $scope.user.item, LatLng: converted});
    });
  };

  //this function filters map based on what user enters into filter field
  $scope.filterMap = function() {
    var searchInput = $scope.search.input;
    DBActions.filterDB(searchInput);
  };

  //this function retrieves everything from the database and renders a map on page
  //this would happen when user first visits page, when user submits an item, or when user deletes an item
  $scope.initMap = function(){
    Map.loadAllItems();
  };
})

.factory('DBActions', function($http, Map){

  //the 'toSave' parameter is an object that will be entered into database,
  //it has item prop and LatLng properties
  var saveToDB = function(toSave){
  return $http.post('/', toSave)
    .then(function(data){
      console.log('successful post!', data.data);
      Map.addMarker(map, data.data);
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
