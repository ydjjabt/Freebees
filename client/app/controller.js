var app = angular.module('myApp', ['map.services', 'auth'])

//dependencies injected include DBActions factory and Map factory
.controller('FormController', function($scope, $http, DBActions, Map){
  $scope.user = {};

  $scope.clearForm = function(){
    //need a way to clear addresses filled with autocomplete, angular doesn't detect autocomplete as a change in DOM
    document.getElementById('inputAddress').value = '';
    $scope.user = {};
    $scope.search = {};
  };

  //define function within this controller to convert a string to lowerCase for standardization
  var convertToLowerCase = function(itemString){
    return itemString.toLowerCase();
  };

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  $scope.sendPost = function(){
    //convert inputted item name to lowerCase
    console.log('rand sendPost')
    var lowerCaseItem = convertToLowerCase($scope.user.item);
    //convert inputted address, need to get value with JS bc angular can't detect autocomplete
    var inputtedAddress = document.getElementById('inputAddress').value;

    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var img = document.createElement("img");
    var reader = new FileReader();

    reader.onload = function (e){
      console.log(typeof reader.result);
      var pictureData ;//= reader.result;
      img.src = reader.result;
      var MAX_WIDTH = 300;
      var MAX_HEIGHT = 300;
      var width = img.width;
      var height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      var canvas =  document.createElement("canvas")
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);
      pictureData = canvas.toDataURL();
      console.log(pictureData)
      var uuid = guid();
      Map.geocodeAddress(geocoder, Map.map, inputtedAddress, function(converted){
      //after address converted, save user input item and location to db
        DBActions.saveToDB({item: lowerCaseItem, LatLng: converted, uuid: uuid, createdAt: new Date(), picture: pictureData });
    });
    }
    reader.readAsDataURL(file);


    $scope.clearForm();
  };

  //this function filters map based on what user enters into filter field
  $scope.filterMap = function(){
    //convert inputted filter item to lowerCase so that matches with lowerCase values stored in db
    var lowerCaseFilterItem = convertToLowerCase($scope.search.input);
    var searchInput = lowerCaseFilterItem;
    DBActions.filterDB(searchInput);
    $scope.clearForm();
  };

  //this function retrieves everything from the database and renders a map on page
  //this would happen when user first visits page, when user submits an item, or when user deletes an item
  $scope.initMap = function(){
    Map.loadAllItems();
  };
  //removes a posting from the db and from the map
  $scope.removePost = function(uuid){
    console.log("called removePost");
    DBActions.removeFromDB({uuid: uuid});
    $scope.clearForm();
  };

  $scope.log

  //fills in the address field with current lat/lng
  $scope.ip = function(){
    startSpinner();
    //check for the HTML5 geolocation feature, supported in most modern browsers
    if (navigator.geolocation){
      //async request to get users location from positioning hardware
      navigator.geolocation.getCurrentPosition(function(position){
        //if getCurrentPosition is method successful, returns a coordinates object
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        document.getElementById('inputAddress').value = lat + ', ' + long;
        stopSpinner();
      });
    } else {
      error('Geo Location is not supported');
    }
  };
  $scope.clearForm();
})

.factory('DBActions', function($http, $window, Map){
  //the 'toSave' parameter is an object that will be entered into database,
  //'toSave' has item prop and LatLng properties
  var addUser = function (user){
    return $http.post('/user', user)
    .then (function (data){
      console.log(data);

    }, function(err){
      console.log("error when adduser invoked - post to users failed.Error", err);
    });
  }

  var saveToDB = function(toSave){
  return $http({
    method: 'POST',
    url: '/submit',
    headers: {
      'x-access-token': $window.localStorage.token
    },
    data: toSave
  })
    //after item has been saved to db, returned data has a data property
    //so we need to access data.data, see below
    .then(function(data){
      stopSpinner();
      //data.data has itemName prop, itemLocation prop, and _id prop, which are all expected since this is how
      //our mongoDB is formatted. Anything returned from db should have these props
      Map.addMarker(map, data.data, infoWindow);
      //the 'map' argument here is referencing the global map declared in app.js
      //this could be manipulated in chrome console by user. Future refactor could be to store
      //map within Map factory instead of global space.
    }, function(err){
      console.log('Error when saveToDB invoked - post to "/" failed. Error: ', err);
    });
  };

  //this function creates a new map based on filtering by whatever user enters in filter field
  //it is invoked within $scope.filterMap, see the above controller
  var filterDB = function(toFilterBy){

    //gets everything from the db in an obj referenced as data
    return $http({
      method: 'GET',
      url: '/api/items',
      headers: {
        'x-access-token': $window.localStorage.token
      },
    })
      .then(function(data){
        //console.log(data)
        //filter our returned db by the desired itemName
        var filtered = data.data.filter(function(item){
          return item.itemName.indexOf(toFilterBy) > -1;
        });

        //re-initialize map with only these markers
        Map.initMap(filtered);
      }, function(err){
        console.log('Error when filterDB invoked - get from "/api/items" failed. Error: ', err);
      });
  };

  var removeFromDB = function(toRemove){
    console.log("Called removeFromDB");
    return $http({
      method: 'POST',
      url: '/api/items',
      headers: {
        'x-access-token': $window.localStorage.token
      },
      data: toRemove
    })
      .then(function(data){
        loadAllItems();
      }, function(err){
        console.log('Error when removeFromDB invoked - post to "/pickup" failed. Error: ', err);
      });
  };

  //the DBActions factory returns the below object with methods of the functions
  //defined above
  return {
    saveToDB: saveToDB,
    filterDB: filterDB,
    removeFromDB: removeFromDB
  };
})
