angular.module('citizen-engagement').controller('MapCtrl', function(IssueService, $timeout, $http, apiUrl, mapboxSecret, geolocation, $log, $scope, $state, leafletData) {
  var mapCtrl = this;

  //create the map
  var mapboxMapId = 'mapbox.satellite';  // define mapbox tileset
  // Build the tile layer URL
  var mapboxTileLayerUrl = 'http://api.tiles.mapbox.com/v4/' + mapboxMapId;
  mapboxTileLayerUrl = mapboxTileLayerUrl + '/{z}/{x}/{y}.png';
  mapboxTileLayerUrl = mapboxTileLayerUrl + '?access_token=' + mapboxSecret;

  mapCtrl.defaults = {
      tileLayer: mapboxTileLayerUrl
    };
  mapCtrl.markers = [];
  mapCtrl.center = {
    lat: 51.48,
    lng: 0,
    zoom: 16
  };

  //geolocation: get position of the user
  geolocation.getLocation().then(function(data){
    mapCtrl.center.lat = data.coords.latitude;
    mapCtrl.center.lng = data.coords.longitude;
    $timeout(loadMarkers, 0);
  }).catch(function(err) {
    $log.error('Could not get location because: ' + err.message);
  });

  /*
  IssueService.getIssues().then(function(issues) {
    console.log(issues);
    //issueCtrl.issues = issues;
    createMarkers(issues);
  });

  */


  //Add issues marker on the map
  function createMarkers(issues) {
    for(var i=0; i<issues.length; i++){
      mapCtrl.markers.push({
        lat: issues[i].location.coordinates[1],
        lng: issues[i].location.coordinates[0],
        issue: issues[i]
      });
    }
  }

  //load markers when user move on the map
  $scope.$on('leafletDirectiveMap.moveend', function(event, map){
    loadMarkers();
  });

  //load markers on a user's location (on the map)
  function loadMarkers() {
    leafletData.getMap().then(function(map) {
      IssueService.getIssuesByLocation(map).then(function(issues){
        mapCtrl.markers = [];
        createMarkers(issues);
      });
    });
  }

  //Redirect to issueDetails when click event on a marker
  $scope.$on('leafletDirectiveMarker.click', function(event, marker) {
    console.log(marker.model.issue);
    $state.go('tab.issueDetailsMap', {issueId: marker.model.issue.id});
  });

});
