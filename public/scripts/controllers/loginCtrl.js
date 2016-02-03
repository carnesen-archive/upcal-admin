app.controller('loginCtrl', ['$scope', '$http', 'authService', '$location',
  function ($scope, $http, authService, $location) {

    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
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