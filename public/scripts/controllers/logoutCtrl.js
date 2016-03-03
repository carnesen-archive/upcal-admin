app.controller('logoutCtrl', ['$scope','$location', 'ccFactory', function($scope, $location, ccFactory){
  $scope.bool = false;

  // if logged in, don't redirect. if not logged in, redirect to login page
  if(!hello( 'google' ).getAuthResponse()) {
    $scope.bool = false;
    $location.path('/');
  } else {
    $scope.bool = true;
  }

  // log out and reload this page which will trigger the above function to send back to login page
  $scope.logout = function(){
    return hello('google').logout().then(function() {
      $scope.bool = false;
      location.reload();
    }, function(e) {
      alert('Signed out error: ' + e.error.message);
    });
  };

}]);