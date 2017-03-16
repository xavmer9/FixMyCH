angular.module('citizen-engagement').controller('MapCtrl', function($http, apiUrl, geolocation, $log) {
  var mapCtrl = this;

  //geolocation stuff
  geolocation.getLocation().then(function(data){
    mapCtrl.latitude = data.coords.latitude;
    mapCtrl.longitude = data.coords.longitude;
    console.log(mapCtrl.latitude);
  }).catch(function(err) {
    $log.error('Could not get location because: ' + err.message);
  });
  //console.log(mapCtrl.latitude);
  mapCtrl.defaults = {};
  mapCtrl.markers = [];
  mapCtrl.center = {
    lat: mapCtrl.latitude,
    lng: mapCtrl.longitude,
    zoom: 14
  };
});
