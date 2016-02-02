app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;
  $scope.newTag = '';
  $scope.searchByTags = [];
  $scope.possibleSearchTags = [];
  $scope.currentPage = 1;
  $scope.startNumber = 0;
  $scope.itemsPerPage = 20;
  $scope.totalPages = 0;
  $scope.maxSize = 5;
  $scope.bigCurrentPage = 1;

  $scope.setPage = function(){
    console.log($scope.currentPage);
    $scope.adjustList();
  };

  $scope.adjustList = function(){
    $scope.startNumber = ($scope.currentPage - 1) * 20;
    console.log($scope.startNumber)
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
    $scope.totalPages = Math.floor($scope.eventList.length/20);
    console.log($scope.totalPages);
  });


  $scope.openEdit = function(event,eventIndex){

    $scope.currentEvent = event;
    ccFactory.open(event).then(function(response){
      if(response.calendarId){
        ccFactory.putRow(response).then(function(success){
          if (success !== 'success'){
            console.log('Row Update Failed')
          } else {
            $scope.eventList[eventIndex] = response;
          }
        });
      } else {
        ccFactory.postRow(response).then(function(newEvent){
          console.log(newEvent);
          $scope.eventList.unshift(newEvent);
          newEvent.tags.forEach(function(elem){
            $scope.eventList.possibleTags.pushUnique(elem)
          });
        });
      }
    });

  };

  $scope.addTag = function(newTag){
    console.log('my new tag:',newTag);
    $scope.currentEvent.tags.push(newTag);
  };

  $scope.saveRow = function(){
    ccFactory.putRow($scope.currentEvent);
  };

}]);
