angular.module('citizen-engagement').factory('IssueService', function($http, apiUrl) {
  var service = {};

  //Get all issues
  service.getIssues = function(page, items) {
    page = page || 1; // Start from page 1
    items = items || [];
    // GET the current page
    return $http({
      method: 'GET',
      url: apiUrl + '/issues',
      params: {
        page: page
      }
    }).then(function(res) {
      if (res.data.length) {
        // If there are any items, add them
        // and recursively fetch the next page
        items = items.concat(res.data);
        return service.getIssues(page + 1, items);
      }
      return items;
    });
  };

  return service;

});

angular.module('citizen-engagement').controller('IssuesCtrl', function(IssueService) {
  var issueCtrl = this;

  IssueService.getIssues().then(function(issues) {
    console.log(issues);
    issueCtrl.issues = issues;
  })


});
