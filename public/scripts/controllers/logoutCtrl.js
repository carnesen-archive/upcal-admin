app.controller('logoutCtrl', ['$scope','$location', 'ccFactory', function($scope, $location, ccFactory){
  $scope.bool = false;

  if(!hello( 'google' ).getAuthResponse()) {
    $scope.bool = false;
    $location.path('/');
  } else {
    $scope.bool = true;
  }

  $scope.logout = function(){
    return hello('google').logout().then(function() {
      $scope.bool = false;
      location.reload();
    }, function(e) {
      alert('Signed out error: ' + e.error.message);
    });
  };

}]);