app.controller('loginCtrl', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {

    // if already logged in, go straight to ccTable
    if(hello( 'google' ).getAuthResponse()){
      $location.path('/ccTable')
    }

    // if click login, trigger function, log in with google
    $scope.login = function() {
      $http.get('/api/clientInfo').then(function (response) {
        var clientID = response.data.clientID; // client id for this app
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
}]);