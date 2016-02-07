app.controller('loginCtrl', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {
    if(hello( 'google' ).getAuthResponse()){
      $location.path('/ccTable')
    }

    $scope.login = function() {
      $http.get('/api/clientInfo').then(function (response) {
        var clientID = response.data.clientID;
        console.log(clientID);
        hello.init({
          google: clientID
        }, {
          redirect_uri: 'http://localhost:3000/'
        });
        hello.login('google', {
          display: 'page',
          scope: 'basic email'
        });
      });
    };
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