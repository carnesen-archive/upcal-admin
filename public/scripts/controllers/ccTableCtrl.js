app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  ccFactory.getTable().then(function(data){
    $scope.table = data;
  })


}]);