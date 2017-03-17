angular.module('citizen-engagement').controller('IssuesCtrl', function($http, apiUrl, geolocation, $log) {
    var issuesCtrl = this;
    issuesCtrl.issues = [];

    //geolocation stuff
    geolocation.getLocation().then(function(data){
    issuesCtrl.latitude = data.coords.latitude;
    issuesCtrl.longitude = data.coords.longitude;
      }).catch(function(err) {
        $log.error('Could not get location because: ' + err.message);
        });

    function toggleOrder(){
      console.log("wo<a");
    }

    $http({
      method: 'GET',
      url: apiUrl + '/issues'
    }).then(function(result) {
      //console.log(result);
      issuesCtrl.issues = result.data;
      console.log(issuesCtrl.issues);
    });
  });
