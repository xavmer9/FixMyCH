angular.module('citizen-engagement').controller('MapCtrl', function($http, apiUrl, geolocation, $log, $scope, $state, leafletData) {
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
    method: 'GET', //post
    url: apiUrl + '/issues',//searches mongodb geoWithin leaflet docs getmap leafletData.getMap().then()
    params: {pageSize: 50}
  }).then(function(result) {
    //console.log(result);
    createMarkers(result.data);
    console.log(mapCtrl.locations);
  });

  function createMarkers (issues) {
    for(var i=0; i<issues.length; i++){
        mapCtrl.markers.push({
        lat: issues[i].location.coordinates[1],
        lng: issues[i].location.coordinates[0],
        issue: issues[i]
      });
    }
  }

  $scope.$on('leafletDirectiveMap.dragend', function(event, map){
    $http({
      method: 'GET',
      url: apiUrl + '/issues',
      params: {
        page: 2,
        pageSize: 50
      }
    }).then(function(result) {
      //console.log(result);
      createMarkers(result.data);
      console.log(mapCtrl.locations);
    });
  });

  $scope.$on('leafletDirectiveMarker.click', function(event, marker) {
    console.log(marker.model.issue);
    $state.go('tab.issueDetailsMap', {id: marker.model.issue.id});
  });

});
