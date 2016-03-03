// handles actions in modal - $uibModalInstance.close = save event changes, .dismiss = abandons event changes
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, currentEvent){
  $scope.currentEvent = currentEvent;
  $scope.ok = function () {
    $uibModalInstance.close($scope.currentEvent);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
