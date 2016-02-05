app.controller('loginCtrl', ['$scope', '$http', 'authService', '$location',
  function ($scope, $http, authService, $location) {

    $http.get('/clientInfo').then(function(response){
      var clientID = response.data.clientID;
      hello.init(
        {google : clientID },
        {redirect_uri:'redirect.html'}
      );

      login();
    });

    function login() {
      hello( 'google' ).login( function() {
        var token = hello( 'google' ).getAuthResponse().access_token;
        console.log(token)
      });
    }

  //$http.post('api/login', $scope.form)
  //  .then(function (response) {
  //
  //
  //    // save json web token in session storage
  //    authService.saveToken(response.data);
  //
  //    // redirect to projects page
  //    $location.path('/bridge/' + $scope.form.username);
  //  }, function () {
  //    // wipe out the stored token
  //    authService.logout();
  //  })
}]);