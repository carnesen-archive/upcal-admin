
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance){
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
