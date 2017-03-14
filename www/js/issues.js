angular.module('citizen-engagement').controller('IssuesCtrl', function($http, apiUrl) {
    var issuesCtrl = this;
    issuesCtrl.issues = [];

    $http({
      method: 'GET',
      url: apiUrl + '/issues'
    }).then(function(result) {
      //console.log(result);
      issuesCtrl.issues = result.data;
      console.log(issuesCtrl.issues);
    });
  });
