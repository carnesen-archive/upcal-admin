app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;
  $scope.newTag = '';
  $scope.searchByTags = [];
  $scope.possibleSearchTags = [];

  $scope.returnPossibleTags = function(query){
    var array = [];
    for (var i = 0 ; i < $scope.possibleSearchTags.length;i++){
      if ($scope.possibleSearchTags[i].text.indexOf(query) !== -1){
        array.push($scope.possibleSearchTags[i])
      }
    }
    return array;
  };

  $scope.filterResults = function(){

  };

  ccFactory.getTable().then(function(eventList){
    $scope.possibleSearchTags = eventList.possibleTags;
    $scope.eventList = eventList;
    console.log('alksjeflkjes',$scope.possibleSearchTags)
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
    ccFactory.putRow($scope.currentEvent);
  }
}]);
