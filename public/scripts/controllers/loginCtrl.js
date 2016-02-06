app.controller('loginCtrl', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {

    $scope.login = function(){
      $http.get('/api/clientInfo').then(function(response){
        var clientID = response.data.clientID;
        console.log(clientID);
        hello.init(
          {google : clientID },
          {redirect_uri:'http://localhost:3000'}
        );
        login();
      });
    };
    function login() {
      hello( 'google' ).login( function() {
        var token = hello( 'google' ).getAuthResponse().access_token;
        $location.path('/ccTable.html');
        console.log(token)
      }, function(e){
        alert('login failed. Error:', e);
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