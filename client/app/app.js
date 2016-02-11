var map;
var initMap = function(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7833, lng: -122.4167},
    zoom: 14
  });

  var geocoder = new google.maps.Geocoder();
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
    var infowindow = new google.maps.InfoWindow({
        content: test[i].contentString
      });

    var marker = new google.maps.Marker({
        position: test[i].myLatLng,
        map: map,
        title: 'Hello World!'
      });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
  }
  //geocode inputted address on submit
  document.getElementById('submit').addEventListener('click', function(){
    geocodeAddress(geocoder, map);
  });
};

var geocodeAddress = function(geocoder, resultsMap){
  var address = document.getElementById('address').value;
  alert('address is, ', address);
  geocoder.geocode({'address': address}, function(results, status) {
    console.log('results from geocodeaddress fn is: ', results);
    if (status == google.maps.GeocoderStatus.OK) {
      alert('got an okay status from geocoder');
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};
