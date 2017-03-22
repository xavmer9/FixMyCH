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

angular.module('citizen-engagement').controller('CreateCtrl', function($q, $stateParams, $ionicPopup, $http, $scope, $state, CameraService, $log, apiUrl, geolocation, qimgSecret, qimgUrl ) {

  var createCtrl = this;
  $scope.$on('$ionicView.beforeEnter', function() {

    $http({
      method: 'GET',
      url: apiUrl + '/issueTypes'
    }).then(function(res){
      createCtrl.issueTypes = res.data;
    
    });

  });

  createCtrl.issue = {};

  // Take a picture and attach it to "createCtrl.issue"
  createCtrl.takePicture = function() {
    // Display an alert if the camera is not supported
    if (!CameraService.isSupported()) {
      return $ionicPopup.alert({
        title: 'Not supported',
        template: 'You cannot use the camera on this platform'
      });
    }

    // Take the picture
    CameraService.getPicture({ quality: 50 }).then(function(result) {
      $log.debug('Picture taken!');
      createCtrl.pictureData = result;
    }).catch(function(err) {
      $log.error('Could not get picture because: ' + err.message);
    });
  };

  // Create an issue:
  // * First upload the picture to the qimg API
  // * Then create the issue using the image URL provided by the qimg API
  createCtrl.createIssue = function() {
    return postImage().then(postIssue);
  };

  function postImage() {
    if (!createCtrl.pictureData) {
      // If no image was taken, return a promise resolved with "null"
      return $q.when(null);
    }

    // Upload the image to the qimg API
    return $http({
      method: 'POST',
      url: qimgUrl + '/images',
      headers: {
        Authorization: 'Bearer ' + qimgSecret
      },
      data: {
        data: createCtrl.pictureData
      }
    });
  }

  function postIssue(imageRes) {



    // Use the image URL from the qimg API response (if any)
    if (imageRes) {
      createCtrl.issue.imageUrl = imageRes.data.url;
    }

    geolocation.getLocation().then(function(data){
        var x = data.coords.latitude;
        var y = data.coords.longitude;

        // if some optional inputs are undefined, set them to null

       
        if(!createCtrl.tags){
          var tags=[];
        }else{
          // we split the user input seperated by coma to create the right tags

          var tags = createCtrl.tags.split(',');
        }
        

        // we call the service to create the issue

        return $http({
        method: 'POST',
        url: apiUrl+'/issues',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "description": createCtrl.issue.description,
          "tags": tags,
          "imageUrl": createCtrl.issue.imageUrl,
          "location": {
            "coordinates": [
              y,
              x
            ],
            "type": "Point"
          },
          "issueTypeHref": createCtrl.issue.issue_type.href

      }        
      }).then(function(res) {

        // empty the form
       
       createCtrl.pictureData ="";
       createCtrl.issue.description ="";
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
