app.factory('ccFactory', ['$http', '$uibModal',  function($http, $uibModal){
  var myService = {};
  // get table from database
  myService.getTable = function(){
    return $http({
      url: '/api/events',
      method: 'get'
    }).then(function(response){
      var possibleTags = [];
      var eventList = response.data.map(function(elem){
        elem.tags = elem.tags.map(function(tag){ // tags: [{text: 'tag1'},{text: 'tag2'},{text: 'tag3'}]
          possibleTags = myService.pushTagText(tag,possibleTags);
          return {'text':tag};
        });
        elem.startDate = new moment(elem.startDate);
        elem.endDate = new moment(elem.endDate);
        return elem
      });
      possibleTags = possibleTags.map(function(tag){
        return {text:tag};
      });
      eventList.possibleTags = possibleTags;
      return eventList;
    })
  };

  // update table in database
  myService.putRow = function(currentEvent){
    var event = Object.assign({}, currentEvent);
    event = myService.prepareEvent(event);

    return $http({
      url: '/api/events/'+ event.calendarId + '/' + event.eventId,
      method: 'put',
      data: event
    }).then(function(response){
      return 'success';
    })
  };

  myService.postRow = function(newEvent){
    var event = Object.assign({},newEvent);
    event = myService.prepareEvent(event);
    return $http({
      url: '/api/events',
      method: 'post',
      data: event
    }).then(function(response){
      newEvent.calendarId = response.data.calendarId;
      newEvent.eventId = response.data.eventId;
      return newEvent;
    })
  };

  myService.deleteRow = function(){
    // pass in id as data
    return $http({
      url: '/api/events',
      method: 'delete'
    }).then(function(response){
      return response.data
    })
  };


  // modal open
  myService.animationsEnabled = true;

  myService.open = function (event) {

    var myEvent = Object.assign({},event);
    var modalInstance = $uibModal.open({
      animation: myService.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
        currentEvent: function () {
          return myEvent;
        }
      }
    });

    return modalInstance.result.then(function (updatedEvent) {
      return updatedEvent;
    });
  };

  myService.prepareEvent = function(event){
    var startDate = event.startDate;
    var endDate = event.endDate;
    event.tags = event.tags.map(function(tag) {
      return tag.text;
    });
    event.startDate = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate();
    event.endDate = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + endDate.getDate();
    return event
  };

  // returns opposite of bool
  myService.toggle = function(bool){
    return !bool;
  };

  myService.pushTagObject = function(item,array){
    for (var i = 0 ; i < array.length ; i++){
      if (array[i].text === item.text){
        return array;
      }
    }
    array.push(item);
    return array;
  };

  myService.pushTagText = function(text, array){
    if(array.indexOf(text) == -1) {
      //if(jQuery.inArray(item, this) == -1) {
      array.push(text);
      return array;
    }
    return array;
  };

  return myService;
}]);
