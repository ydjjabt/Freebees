var map;
var initMap = function(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7833, lng: -122.4167},
    zoom: 14
  });

  // var geocoder = new google.mapsGeocoder();

  var myLatLng = {lat: 37.7833, lng: -122.4167};
  var contentString = "Goodbye World";

  var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

  var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Hello World!'
    });

  marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  // document.getElementById('submit').addEventListener('click', function(){
  //   geocodeAddress(geocoder, map);
  // });
}

// var geocodeAddress = function(geocoder, resultsMap){
//   var address = document.getElementById('address').value;
//   geocoder.geocode({'address': address}, function(results, status) {
//     console.log('trying to geocode');
//   });
// }
