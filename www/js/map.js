angular.module('citizen-engagement').controller('MapCtrl', function(IssueService, $http, apiUrl, mapboxSecret, geolocation, $log, $scope, $state, leafletData) {
  var mapCtrl = this;

  //geolocation: get position of the user
  geolocation.getLocation().then(function(data){
    mapCtrl.center.lat = data.coords.latitude;
    mapCtrl.center.lng = data.coords.longitude;
  }).catch(function(err) {
    $log.error('Could not get location because: ' + err.message);
  });

  //map
  var mapboxMapId = 'mapbox.satellite';  // Use your favorite tileset here
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
    zoom: 13
  };

  IssueService.getIssues().then(function(issues) {
    console.log(issues);
    //issueCtrl.issues = issues;
    createMarkers(issues);
  })

  //get all issues from user's location
  /*
  $http({
  method: 'GET', //post
  url: apiUrl + '/issues',
  params: {pageSize: 50}
}).then(function(result) {
//console.log(result);
createMarkers(result.data);
//console.log(mapCtrl.locations);
});

*/

leafletData.getMap().then(function(map) {
  map.on('click', function(e) {
    console.log("Latitude : " + e.latlng.lat + " Longitude :  "+ e.latlng.lng);
  });
});

  function createMarkers (issues) {
    console.log(issues);
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
      method: 'POST',
      url: apiUrl + '/issues/searches',
      data: {
        "location": {
          "$geoWithin": {
            "$centerSphere" : [
              [ 6.622009 , 46.766129 ],
              0.1
            ]
          }
        }
      }
    }).then(function(result) {
      //console.log(result);
      createMarkers(result.data);
      console.log(mapCtrl.locations);
    });
  });

  //Redirect to issueDetails
  $scope.$on('leafletDirectiveMarker.click', function(event, marker) {
    console.log(marker.model.issue);
    $state.go('tab.issueDetailsMap', {issueId: marker.model.issue.id});
  });

});
