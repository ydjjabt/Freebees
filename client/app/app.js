angular.module('map.services', []) //

.factory('Map', function($http, $window){
  var entireDB;
  /*errObj is the object created upon failure. It has a .status prop
  exceptionType is a string, could be 'timeout', 'abort', 'error', or others
  these two paramaters are automatically accessible within ajax erorr callback*/
  var errorHandler = function(errObj, exceptionType){
    var msg = '';
    if(errObj.status === 0){
      msg = 'Not connected. Verify network.';
      console.log('xxxxx this is the error: ', errObj);
    } else if (errObj.status === 404){
      msg = 'Requested page was not found ' + errObj.status;
      console.log('xxxxx this is the error: ', errObj);
    } else if (errObj.status === 500){
      msg = 'Internal server error ' + errObj.status;
      console.log('xxxxx this is the error: ', errObj);
    } else if (exceptionType === 'parserror'){
      msg = 'Requested JSON parse failed';
      console.log('xxxxx this is the error: ', errObj);
    } else if (exceptionType === 'timeout'){
      msg = 'Request timed out';
      console.log('xxxxx this is the error: ', errObj);
    } else if (exceptionType === 'abort'){
      msg = 'Request was aborted';
      console.log('xxxxx this is the error: ', errObj);
    }
    // add error message to top of html's body
    $('body').prepend('<h1>' + msg + '</h1>');
  };

  //called from index.html when googleapi lib is loaded
  $window.loadAllItems = function(){
    $.ajax({
      url: '/api/items',
      type: 'GET',
      success: function(data){
        initMap(data);
      },
      error: function(jqXHR, exception){
        errorHandler(jqXHR, exception);
      }
    });
  };

  //create an instance of a map where the data passed in is an array of objs
  var initMap = function(data){
    $window.directionsDisplay = new google.maps.DirectionsRenderer();
    $window.directionsService = new google.maps.DirectionsService();
    $window.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.764115, lng: -122.435280},
      scrollwheel: false,
      zoom: 12
    });
    $window.directionsDisplay.setMap($window.map);
    //creates a global infowindow that will show only one window at a time
    $window.infoWindow = new google.maps.InfoWindow();

    //Geocoder is an object Google maps w/ various methods API to pull their geocoding functionality
    $window.geocoder = new google.maps.Geocoder();
    //loop through data returned from db to place on map
    for (var i = 0; i < data.length; i++){
      addMarker($window.map, data[i], infoWindow, i*30);
    }
    //add autocomplete functionality to address input field using google maps api
    var input = document.getElementById('inputAddress');
    var options = {};
    var autocomplete = new google.maps.places.Autocomplete(input, options);
  };

  /*add a marker to map. Instance needs to be an obj with itemLocation and itemName properties. The last parameter, timeout
  is passed in as a parameter to sequentially add each item so the markers drop down sequentially */
  var removeFromDB = function(toRemove){
    console.log("Called removeFromDB");
    console.log("toRemove", toRemove);
    return $http({
      method: 'POST',
      url: '/remove',
      headers: {
        'x-access-token': $window.localStorage.token,
        'Content-Type': 'application/json'
      },
      data: toRemove
    })
      .then(function(data){
        $window.loadAllItems();
        console.log("Got data", data);
      }, function(err){
        console.log('Error when removeFromDB invoked - post to "/remove" failed. Error: ', err);
        if(err.data.success === false) {
          alert(err.data.message);
        }
      });
  };

  var addMarker = function(map, instance, infoWindow, timeout){
    window.setTimeout(function(){
      var links = [
        "https://27.media.tumblr.com/tumblr_m31scizkkw1rue873o1_250.png",
        "https://27.media.tumblr.com/tumblr_m32246Cc441rue873o1_250.png",
        "https://26.media.tumblr.com/tumblr_m31xlvS1cO1rue873o1_250.png",
        "https://41.media.tumblr.com/81f20b3f073d38c550b0938686909785/tumblr_mtrty9S2y31rue873o1_500.png",
        "https://40.media.tumblr.com/tumblr_m9473r4uzP1rue873o1_400.png",
        "https://29.media.tumblr.com/tumblr_m33zy6VrLb1rue873o1_r1_400.png",
        "https://27.media.tumblr.com/tumblr_m31sikdoyE1rue873o1_250.png"
      ]
      var image = {
        //horizontal bee
        //url: 'https://openclipart.org/image/90px/svg_to_png/221154/Cartoon-Bee.png',
        url: links[Math.floor(Math.random() * links.length)],
        // This marker is 41 pixels wide by 61 pixels high.
        scaledSize: new google.maps.Size(31, 51),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 61).
        anchor: new google.maps.Point(0, 61),
      };

      //create a new instance of a google maps marker, will be created for each item in our db
      var marker = new google.maps.Marker({
        position: instance.itemLocation,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: image,
        title: instance.uuid
      });

      //creates a listener that will attach this instance's data to the global info window and open it
      google.maps.event.addListener(marker, 'click', function(){
        //turn our mongo-stored stringified date into a JS date obj that is then formatted
        $window.infoWindow.setContent('<div>' + instance.itemName + '<br><span class="createdAt">' + formatDate(new Date(instance.createdAt)) + '</span>'
          + '<br><img src="' + instance.picture + '">'
          + '<br>Directions:<select id=' + 'SELECTOR_' + instance.uuid + '>'
          + '<option value="DRIVING">Driving</option>'
          + '<option value="WALKING">Walking</option>'
          + '<option value="BICYCLING">Bicycling</option>'
          + '<option value="TRANSIT">Transit</option>'
          + '</select>'
          + '<br><button class="removeMarker" id=' + instance.uuid + '>Delete</button>');
        $window.infoWindow.open(map, this);
        google.maps.event.addDomListener(document.getElementById(instance.uuid), 'click', function() {
          removeFromDB({uuid: instance.uuid});
        });
        google.maps.event.addDomListener(document.getElementById('SELECTOR_' + instance.uuid), 'change', function() {
          var selectedMode = document.getElementById("SELECTOR_" + instance.uuid).value;
          navigator.geolocation.getCurrentPosition(function(pos) {
            var request = {
              origin: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
              destination: instance.itemLocation,
              travelMode: google.maps.TravelMode[selectedMode]
            };
            $window.directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                $window.directionsDisplay.setDirections(response);
              }
            });
          })
        });
      });
    }, timeout);
  };

  //grab the address the client has typed in to send to turn into longitude/latitude
  var geocodeAddress = function(geocoder, resultsMap, address, cb){
    //calls the geocode method on Google Map's geocode obj
    geocoder.geocode({'address': address}, function(results, status){
      //if successful conversion, return the result in a cb ,
      if (status === google.maps.GeocoderStatus.OK){
        cb(results[0].geometry.location);
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  var formatDate = function(dateObj){
    var month = dateObj.getMonth() + 1;
    var day = dateObj.getDate();
    var year = dateObj.getFullYear().toString().slice(2);
    return month + '/' + day + '/' + year;
  };

  $window.startSpinner = function(){
    $('.spinner img').css('visibility', 'visible');
  };

  $window.stopSpinner = function(){
    $('.spinner img').css('visibility', 'hidden');
  };

  return {
    initMap: initMap,
    geocodeAddress: geocodeAddress,
    addMarker: addMarker,
  };
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
  };

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
        $window.stopSpinner();
        //data.data has itemName prop, itemLocation prop, and _id prop, which are all expected since this is how
        //our mongoDB is formatted. Anything returned from db should have these props
        Map.addMarker($window.map, data.data, infoWindow);
        //the 'map' argument here is referencing the global map declared in app.js
        //this could be manipulated in chrome console by user. Future refactor could be to store
        //map within Map factory instead of global space.
      }, function(err){
        console.log('Error when saveToDB invoked - post to "/submit" failed. Error: ', err);
        if(err.data.success === false) {
          alert(err.data.message);
        }
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
    return $http({
      method: 'POST',
      url: '/api/items',
      headers: {
        'x-access-token': $window.localStorage.token
      },
      data: toRemove
    })
      .then(function(data){
        $window.loadAllItems();
      }, function(err){
        console.log('Error when removeFromDB invoked - post to "/pickup" failed. Error: ', err);
        if(err.data.success === false) {
          alert(err.data.message);
        }
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
