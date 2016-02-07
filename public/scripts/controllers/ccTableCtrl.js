app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;
  $scope.newTag = '';
  $scope.searchByTags = [];
  $scope.possibleSearchTags = [];
  $scope.currentPage = 1;
  $scope.startNumber = 0;
  $scope.itemsPerPage = 20;
  $scope.totalPages = 0;
  $scope.maxSize = 8;
  $scope.bigCurrentPage = 1;

  $scope.setPage = function(){
    $scope.adjustList();
  };

  $scope.adjustList = function(){
    $scope.startNumber = ($scope.currentPage - 1) * 20;
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

  // If tags are not undefined and are matching, increment 'checkMatches', only push event if all tags match.
  function filterMatches(event){
    var searchDeleted = false;
    var checkMatches = 0; // counter to only lets events that match all searchByTags through
    for (var x = 0 ; x < $scope.searchByTags.length ; x++){
      if ($scope.searchByTags[x].text === 'deleted'){
        searchDeleted = true;
      }
    }
    for (var i in event.tags){
      if (event.tags[i].text === 'deleted' && searchDeleted === true){
        return event;
      } else if (event.tags[i].text === 'deleted' && searchDeleted === false){
        return
      }
      for (var x in $scope.searchByTags) {
        if (event.tags[i].text && $scope.searchByTags[x].text){
          if (event.tags[i].text === $scope.searchByTags[x].text) {
            checkMatches += 1;
          }
        }
      }
    }
    if ($scope.searchByTags.length === checkMatches){return event}
  }

  $scope.eventFilter = function(){
    $scope.filteredEvents = $scope.eventList.filter(filterMatches);
    $scope.filteredEvents.sort(function(a, b) {
      return (a.startDate < b.startDate) ? -1 : 1;
    });
  };

  ccFactory.getTable().then(function(eventList){
    $scope.possibleSearchTags = eventList.possibleTags;
    $scope.eventList = eventList;
    $scope.eventFilter($scope.eventList);

    $scope.totalPages = Math.floor($scope.eventList.length/20);
  });


  $scope.openEdit = function(event,eventIndex){

    $scope.currentEvent = event;
    ccFactory.open(event).then(function(response){
      if(response.calendarId){
        ccFactory.putRow(response).then(function(success){
          if (success !== 'success'){
          } else {
            $scope.eventList[eventIndex] = response;
          }
        });
      } else {
        response.tags = ccFactory.pushTagObject({'text': 'User Created'},response.tags);
        ccFactory.postRow(response).then(function(newEvent){
          $scope.eventList.unshift(newEvent);
          newEvent.tags.forEach(function(elem){
            $scope.eventList.possibleTags = ccFactory.pushTagObject(elem,$scope.eventList.possibleTags)
          });
        });
      }
    });
  };

  $scope.deleteEvent = function(eventIndex){
    $scope.eventList[eventIndex].tags = ccFactory.pushTagObject({'text': 'deleted'},$scope.eventList[eventIndex].tags);
    $scope.eventList.possibleTags = ccFactory.pushTagObject({'text': 'deleted'},$scope.eventList.possibleTags);
    $scope.eventFilter();
    ccFactory.putRow($scope.eventList[eventIndex]).then(function(success){
      if (success !== 'success'){
        console.log('Row Update Failed');
      } else {
        console.log('delete success!');
      }
    });
  };

  $scope.addTag = function(newTag){
    $scope.currentEvent.tags.push(newTag);
  };

  $scope.saveRow = function(){
    ccFactory.putRow($scope.currentEvent);
  };

}]);
