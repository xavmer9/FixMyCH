angular.module('citizen-engagement').controller('MapCtrl', function($http, apiUrl, geolocation, $log, $scope, $state) {
  var mapCtrl = this;

  //geolocation: get position of the user
  geolocation.getLocation().then(function(data){
    mapCtrl.center.lat = data.coords.latitude;
    mapCtrl.center.lng = data.coords.longitude;
    console.log(mapCtrl.latitude);
    console.log(mapCtrl.longitude);
  }).catch(function(err) {
    $log.error('Could not get location because: ' + err.message);
  });

  //map
  mapCtrl.defaults = {};
  mapCtrl.markers = [];
  mapCtrl.center = {
    lat: 51.48,
    lng: 0,
    zoom: 14
  };

  $http({
    method: 'GET',
    url: apiUrl + '/issues'
  }).then(function(result) {
    //console.log(result);
    createMarkers(result.data);
    console.log(mapCtrl.locations);
  });

  function createMarkers (issues) {
    for(var i=0; i<issues.length; i++){
        mapCtrl.markers.push({
        lat: issues[i].location.coordinates[1],
        lng: issues[i].location.coordinates[0]
      });
    }
  }

  //$scope.$on('leafletDirectiveMap.dragend', function(event, map){
  //});

  $scope.$on('leafletDirectiveMarker.click', function(event, marker) {
    var coords = marker.model.lng + '/' + marker.model.lat;
    $state.go('tab.issueDetailsMap({ issueId: issue.id })');
    console.log('Marker at ' + coords + ' was clicked');
  });

});
