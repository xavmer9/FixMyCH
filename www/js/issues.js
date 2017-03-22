angular.module('citizen-engagement').factory('IssueService', function($http, apiUrl) {
  var service = {};

  //Get all issues isung POST mehod on issues/searches from the api in order to get send data
  service.getIssues = function(state, page, items) {
    page = page || 1; // Start from page 1
    items = items || [];
    //initialize the request as an object of parameters
    var requestData = {};
    if(state){
      //define the issue's state that we want to get
      requestData.state = state;
    }
    return $http({
      method: 'POST',
      url: apiUrl + '/issues/searches',
      params: {
        page: page,
        pageSize: 50
      },
      data: requestData
    }).then(function(res) {
      if (res.data.length) {
        // If there are any items, add them
        // and recursively fetch the next page
        items = items.concat(res.data);
        return service.getIssues(state, page + 1, items);
      }
      return items;
    });
  };

  //Get issues from a LatLng by location
  service.getIssuesByLocation = function(map, page, items) {
    page = page || 1; // Start from page 1
    var bounds = map.getBounds();
    items = items || [];
    // POST method
    return $http({
      method: 'POST',
      url: apiUrl + '/issues/searches',
      params: {
        page: page,
        pageSize: 50
      },
      data: {
        //define the location of the screen using mongoose geometry query as a polygon
        location: {
          '$geoWithin': {
           '$geometry': {
             type: 'Polygon',
             coordinates: [ [ [ bounds.getSouthWest().lng, bounds.getSouthWest().lat ],
                              [ bounds.getNorthWest().lng, bounds.getNorthWest().lat ],
                              [ bounds.getNorthEast().lng, bounds.getNorthEast().lat ],
                              [ bounds.getSouthEast().lng, bounds.getSouthEast().lat ],
                              [ bounds.getSouthWest().lng, bounds.getSouthWest().lat ]
                          ] ]
           }
          }
        }
      }
    }).then(function(res) {
      if (res.data.length) {
        // If there are any items, add them
        // and recursively fetch the next page
        items = items.concat(res.data);
        return service.getIssuesByLocation(map, page + 1, items);
      }
      return items;
    });
  };

  service.getMyIssues = function() {
    // GET me/issues
    return $http({
      method: 'GET',
      url: apiUrl + '/me/issues',
    }).then(function(res) {
      console.log(res);
      return res.data;
    });
  };


  return service;

});

angular.module('citizen-engagement').controller('IssuesCtrl', function(IssueService) {
  var issuesCtrl = this;
  issuesCtrl.filter = 'all';

  issuesCtrl.toggleMine = function(){

    if(issuesCtrl.filter == 'mine'){
      issuesCtrl.filter = 'all';
    }else {
      issuesCtrl.filter = 'mine';
    }
    loadIssues();
  };

  issuesCtrl.toggleNew = function(){
    if(issuesCtrl.filter == 'new'){
      issuesCtrl.filter = 'all';
    } else {
      issuesCtrl.filter = 'new';
    }
    loadIssues();
  };

  issuesCtrl.toggleInProgress = function(){
    if(issuesCtrl.filter == 'inProgress'){
      issuesCtrl.filter = 'all';
    }else {
      issuesCtrl.filter = 'inProgress';
    }
    loadIssues();
  };

  loadIssues();

  function loadIssues() {
    issuesCtrl.issues = [];
    if (issuesCtrl.filter == 'mine') {
      loadMyIssues();
    } else if (issuesCtrl.filter == 'new') {
      loadAllIssues('new');
    } else if (issuesCtrl.filter == 'inProgress') {
      loadAllIssues('inProgress');
    } else {
      loadAllIssues();
    }
  }

  function loadAllIssues(state){
    IssueService.getIssues(state).then(function(issues) {
      //console.log(issues);
      issuesCtrl.issues = issues;
    });
  }

  function loadMyIssues(){
    IssueService.getMyIssues().then(function(issues) {
      issuesCtrl.issues = issues;
    })
  }
});