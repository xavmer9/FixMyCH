angular.module('citizen-engagement').controller('IssuesCtrl', function($http, apiUrl) {
    var issuesCtrl = this;
    issuesCtrl.issues = [];

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
