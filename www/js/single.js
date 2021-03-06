angular.module('citizen-engagement').controller('SingleCtrl', function($stateParams, $http, $scope, $state, apiUrl) {
  // The $ionicView.beforeEnter event happens every time the screen is displayed.
  var singleCtrl = this;
  $scope.$on('$ionicView.beforeEnter', function() {

    // Re-initialize the user object every time the screen is displayed.
    // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.

    var id = $stateParams.issueId;
   
    getIssue(id).then(function(issue) {
      $scope.issue = issue;
    });

    getIssueComments(id).then(function(comments) {
      $scope.comments = comments;
    });

  });

  function getIssue(id){
    // requete get
      
    return $http({
      method: 'GET',
      url: apiUrl+'/issues/'+id,
      
    }).then(function(res) {

      // If successful, give the token to the authentication service.
     return res.data;

    }).catch(function() {

      // If an error occurs, hide the loading message and show an error message.
      console.log("error no such issue");
      
    });
    
  }

  function getIssueComments(id, page, comments){


     page = page || 1; // Start from page 1
     comments = comments || [];
        
      return $http({
        method: 'GET',
        url: apiUrl+'/issues/'+ id +'/comments?include=author',
        params: {
          page: page
        }
      }).then(function(res) {

        if (res.data.length) {
          // If there are any items, add them
          // and recursively fetch the next page
          comments = comments.concat(res.data);
          return getIssueComments(id ,page + 1, comments);
        }

        return comments;
      });
    
  }

  singleCtrl.addComment = function(){

      
    return $http({
      method: 'POST',
      url: apiUrl+'/issues/'+$scope.issue.id+'/comments',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {"text": singleCtrl.comment},
      params: {include: 'author'}
      
    }).then(function(res) {

     
     $scope.comments.push(res.data);

     // empty the form for new inputs
     singleCtrl.comment ="";
     return res.data;

    }).catch(function() {
      singleCtrl.comment.error = "Please you have to add some content to your comment";
      
      
    });
    
  }

  
  
});