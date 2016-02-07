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
}]);