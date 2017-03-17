console.log("test");

angular.module('citizen-engagement').controller('SingleCtrl', function($stateParams, $http, $scope, $state, apiUrl) {
  // The $ionicView.beforeEnter event happens every time the screen is displayed.
  var singleCtrl = this;
  $scope.$on('$ionicView.beforeEnter', function() {

    // Re-initialize the user object every time the screen is displayed.
    // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.

    var id = $stateParams.issueId;
    console.log(id);
    console.log("test");
    getIssue(id).then(function(issue) {
      console.log(issue);
      $scope.issue = issue;
    });
    getIssueComments(id).then(function(comments) {
      
      $scope.comments = comments;
    });

    //get current logged user so when he adds a comment we know who he is
    getCurrentUser().then(function(user) {
      
      $scope.user = user;
      console.log("testuser");
      console.log($scope.user);
    });
    
    

  });

  function getIssue(id){
    // requete get
    // creation du resultat ou pas?
    console.log("test"+id);
      
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

  function getIssueComments(id){
    // requete get
    // creation du resultat ou pas?
      
    return $http({
      method: 'GET',
      url: apiUrl+'/issues/'+id+'/comments?include=author',
      
    }).then(function(res) {

      // If successful, give the token to the authentication service.
     return res.data;

    }).catch(function() {

      // If an error occurs, hide the loading message and show an error message.
      console.log("error no such issue");
      
    });
    
  }

  singleCtrl.addComment = function(){
    // requete get
    // creation du resultat ou pas?

      
    return $http({
      method: 'POST',
      url: apiUrl+'/issues/'+$scope.issue.id+'/comments',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {"text": singleCtrl.comment},
      params: {include: 'author'}
      
    }).then(function(res) {

      // If successful, give the token to the authentication service.
     
     $scope.comments.push(res.data);
     console.log(res);
     singleCtrl.comment ="";
     return res.data;

    }).catch(function() {
      singleCtrl.comment.error = "Please you have to add some content to your comment";
      // If an error occurs, hide the loading message and show an error message.
      
      
    });
    
  }


  function getCurrentUser(){
    // requete get
      
    return $http({
      method: 'GET',
      url: apiUrl+'/me',
      
    }).then(function(res) {

      // If successful, give the token to the authentication service.
     return res.data;

    }).catch(function() {

      console.log("error no user found");
      
    });
    
  }

  
  
});