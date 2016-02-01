app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;
  $scope.newTag = '';
  $scope.searchByTags = [];
  $scope.possibleSearchTags = [];
  $scope.pageNumber = 1;
  $scope.startNumber = 0;
  $scope.listQuantity = 20;
  $scope.pages = 0;

  $scope.turnPage = function(increment){
    if(increment === -1 && $scope.pageNumber === 1){return;}
    $scope.pageNumber += increment;
    $scope.adjustList();
  };

  $scope.adjustList = function(){
    $scope.startNumber = ($scope.pageNumber - 1) * 20;
  };

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
    $scope.pages = Math.floor($scope.eventList.length/20)
    console.log($scope.pages)
  });


  $scope.openEdit = function(event){
    $scope.currentEvent = event;
    console.log(event);
    ccFactory.open();
  };

  $scope.addTag = function(newTag){
    console.log('my new tag:',newTag);
    $scope.currentEvent.tags.push(newTag);
  };

  $scope.saveRow = function(){
    ccFactory.putRow($scope.currentEvent);
  }
}]);
