app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;
  $scope.newTag = '';
  //ccFactory.getTable().then(function(data){
  //  $scope.table = data;
  //});

  $scope.cues = [{
    name: 'valentines Day',
    status: 'pending',
    startDate:  new Date(2016, 1, 14),
    endDate:  new Date(2016, 1, 14),
    tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
    description: 'A day where couples show their affection publicly'
  }];

  $scope.openEdit = function(cue){
    $scope.currentCue = cue;
    $scope.editForm = ccFactory.toggle($scope.editForm);
  };

  $scope.addTag = function(newTag){
    console.log('my new tag:',newTag);
    $scope.currentCue.tags.push(newTag);
  };
}]);