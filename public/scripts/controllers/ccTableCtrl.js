app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;
  $scope.newTag = '';

  ccFactory.getTable().then(function(eventList){
    $scope.eventList = eventList;
  });

  $scope.openEdit = function(event){
    $scope.currentEvent = event;
    $scope.editForm = ccFactory.toggle($scope.editForm);
  };

  $scope.addTag = function(newTag){
    console.log('my new tag:',newTag);
    $scope.currentEvent.tags.push(newTag);
  };

  $scope.saveRow = function(){
    ccFactory.putTable($scope.currentEvent);
  }
}]);
