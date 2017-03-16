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
    });
    
    console.log("test");
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
      console.log("test3422332324");
      
    });

      //retourner le résultat
    
  }

  // Add the register function to the scope.
  
});