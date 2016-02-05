app.controller('loginCtrl', ['$scope', '$http', 'authService', '$location',
  function ($scope, $http, authService, $location) {

    function login() {
      hello( 'google' ).login( function() {
        var token = hello( 'google' ).getAuthResponse().access_token;
        console.log(token)
      });
    }

    function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }

  $http.post('api/login', $scope.form)
    .then(function (response) {


      // save json web token in session storage
      authService.saveToken(response.data);

      // redirect to projects page
      $location.path('/bridge/' + $scope.form.username);
    }, function () {
      // wipe out the stored token
      authService.logout();
    })
}]);