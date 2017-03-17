angular.module('citizen-engagement').factory('CameraService', function($q) {
  var service = {
    isSupported: function() {
      return navigator.camera !== undefined;
    },
    getPicture: function() {
      var deferred = $q.defer();
      var options = { // Return the raw base64 PNG data
        destinationType: navigator.camera.DestinationType.DATA_URL,
        correctOrientation: true
      };
      navigator.camera.getPicture(function(result) {
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      }, options);
      return deferred.promise;
    }
  };
  return service;
});

angular.module('citizen-engagement').controller('CreateCtrl', function($stateParams, $ionicPopup, $http, $scope, $state, CameraService, $log, apiUrl, geolocation) {
  // The $ionicView.beforeEnter event happens every time the screen is displayed.
  var createCtrl = this;
  $scope.$on('$ionicView.beforeEnter', function() {

    $http({
      method: 'GET',
      url: apiUrl + '/issueTypes'
    }).then(function(res){
      createCtrl.issueTypes = res.data;
    
    });

  });

  createCtrl.takePicture = function() {

    if (!CameraService.isSupported()) {
      return $ionicPopup.alert({
        title: 'Not supported',
        template: 'You cannot use the camera on this platform'
      });
    }

    CameraService.getPicture().then(function(result) {
      $log.debug('Picture taken!');
      createCtrl.pictureData = result;

      
      


    }).catch(function(err) {
      $log.error('Could not get picture because: ' + err.message);
    });
  };
  

  createCtrl.createIssue = function(){
      // requete get
      // creation du resultat ou pas?
      string ="test";

      // we split the user input seperated by coma to create the right tags
      var tags = createCtrl.tags.split(',');


      // we get the location of the user posting the issue

      geolocation.getLocation().then(function(data){
        var x = data.coords.latitude;
        var y = data.coords.longitude;

        // we call the service to create the issue

        return $http({
        method: 'POST',
        url: apiUrl+'/issues',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "description": createCtrl.description,
          "tags": tags,
          "imageUrl": createCtrl.img,
          "location": {
            "coordinates": [
              y,
              x
            ],
            "type": "Point"
          },
          "issueTypeHref": createCtrl.issue_type.href

      }        
      }).then(function(res) {

        // If successful, give the token to the authentication service.
       
       console.log(res);
       createCtrl.img ="";
       createCtrl.description ="";
       createCtrl.tags ="";
       return res.data;

      }).catch(function() {
        createCtrl.error = "Please you have to add some content to your comment";
        // If an error occurs, hide the loading message and show an error message.
        
        
      });
     
      }).catch(function(err) {
        $log.error('Could not get location because: ' + err.message);
      });

      
      
      
  }

});
