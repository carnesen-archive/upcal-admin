app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;

  //ccFactory.getTable().then(function(data){
  //  $scope.table = data;
  //});

  $scope.table = [{

  }];

  $scope.openEdit = function(cue){
    $scope.currentCue = cue;
    toggle($scope.editForm);
  };
}]);