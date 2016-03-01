var app = angular.module('myApp', ['map.services', 'auth', 'plangular'])
.config(function(plangularConfigProvider){
  plangularConfigProvider.clientId = '519fb1126e390271a532264823ca5b87';
})
//dependencies injected include DBActions factory and Map factory
.controller('FormController', function($scope, $http, $window, DBActions, Map){
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
    var lowerCaseItem = convertToLowerCase($scope.user.item);
    //convert inputted address, need to get value with JS bc angular can't detect autocomplete
    var inputtedAddress = document.getElementById('inputAddress').value;
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var img = document.createElement("img");
    var reader = new FileReader();

    reader.onload = function (e){
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
      var uuid = guid();
      Map.geocodeAddress($window.geocoder, $window.map, inputtedAddress, function(converted){
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
    if($scope.search.input === undefined) {
      return $window.loadAllItems();
    }
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
    DBActions.removeFromDB({uuid: uuid});
    $scope.clearForm();
  };

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
.controller("Controller", function ($scope, ModalService){
  $scope.show = function (){
    console.log('show was called')
    ModalService.showModal({
      templateUrl: 'modal.html',
      controller : function(){
        console.log('it works')
      }
    }).then(function(modal){
      modal.element.modal();
       modal.close.then(function(result){
         $scope.customResult = "You said";
       });
    });
  };
})
.controller('modalController', function($scope, close){
  $scope.close = close;
})
