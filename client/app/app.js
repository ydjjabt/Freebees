angular.module('map.services', [])

.factory('Map', function($http){
  return {
    initMap: initMap,
    geocodeAddress: geocodeAddress,
    map: map,
    geocoder: geocoder
  };
});

var map;
var geocoder;

var initMap = function(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7833, lng: -122.4167},
    zoom: 14
  });

  //Geocoder is an object Google maps w/ various methods API to pull their geocoding functionality
  geocoder = new google.maps.Geocoder();
  //test data array
  var test = [
    {
      myLatLng: {lat: 37.7833, lng: -122.4167},
      contentString: "Goodbye World"
    },
    {
      myLatLng: {lat: 38.7833, lng: -122.4167},
      contentString: "Goodbye World #2"
    }
  ];

  //loop through data returned from db to place on map
  for (var i = 0; i < test.length; i++) {
    //create an instance of an info window that will show data when clicked
    var infowindow = new google.maps.InfoWindow({
        content: test[i].contentString
      });

    //create a new instance of a google maps marker, will be created for each item in our db
    var marker = new google.maps.Marker({
        position: test[i].myLatLng,
        map: map,
        title: 'Hello World!'
      });

    //create the click listener on each marker to show their respective info window
    marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
  }
};

//grab the address the client has typed in to send to turn into longitude/latitude
var geocodeAddress = function(geocoder, resultsMap, address, cb){
  //calls the geocode method on Google Map's geocode obj
  console.log('address is, ', address);
  geocoder.geocode({'address': address}, function(results, status) {
    //if successful conversion, return result in a cb
    if (status == google.maps.GeocoderStatus.OK) {
      cb(results[0].geometry.location);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
};
