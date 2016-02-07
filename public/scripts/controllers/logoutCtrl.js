app.controller('logoutCtrl', ['$scope','$location', function($scope, $location){

  $scope.bool = false;
  $scope.logout = function(){
    hello().logout().then(function() {
      alert('Signed out');
      $location.path("/");
    }, function(e) {
      alert('Signed out error: ' + e.error.message);
    });
  };
  if (hello( 'google' ).getAuthResponse()){
    $scope.bool = true;
  }

}]);