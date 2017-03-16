angular.module('citizen-engagement').controller('RegisterCtrl', function(apiUrl, AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
    var registerCtrl = this;
    registerCtrl.user = {
      roles: ["citizen"]
    };

    registerCtrl.register = function() {


        // Show a loading message if the request takes too long.
        $ionicLoading.show({
            template: 'Logging in...',
            delay: 750
        });

        //Build request
        var req = {
            method: 'POST',
            url: apiUrl + "/users",
            headers: {
                'Content-Type': 'application/json'
            },
            data: registerCtrl.user
        }

        $http(req).then(function(res) {

            // If ok, retrieve and get the token
            AuthService.setAuthToken(res.data.token);

            // Hide the loading message.
            $ionicLoading.hide();

            // Set the next view as the root of the history.
            // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });

            // Go to the list of issues
            $state.go('tab.issueList');

        }).catch(function() {

            // If an error occurs, hide the loading message and show an error message.
            $ionicLoading.hide();
            registerCtrl.error = 'Could not register.';
            console.log(registerCtrl.error);
        });
    }
});
