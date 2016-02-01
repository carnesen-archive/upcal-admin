app.factory('ccFactory', ['$http', '$uibModal',  function($http, $uibModal, $log){
  var myService = {};

  // get table from database
  myService.getTable = function(){
    return $http({
      url: '/api/events',
      method: 'get'
    }).then(function(response){
      var possibleTags = [];
      console.log('get response', response);
      var eventList = response.data.map(function(elem){
        elem.tags = elem.tags.map(function(tag){ // tags: [{text: 'tag1'},{text: 'tag2'},{text: 'tag3'}]
          possibleTags.pushUnique(tag);
          return {'text':tag};
        });
        elem.startDate = new Date(elem.startDate);
        elem.endDate = new Date(elem.endDate);
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
    var event = Object.assign({},newEvent);
    event = myService.prepareEvent(event);

    console.log(event);
    return $http({
      url: '/api/events',
      method: 'put',
      data: event
    }).then(function(response){
      var possibleTags = [];
      console.log('put response', response);
      return response.data;
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
      console.log('put response', response);
      return response.data
    })
  };


  // modal open
  myService.animationsEnabled = true;

  myService.open = function (event) {

    var myEvent = Object.assign({},event);
    console.log('myEvent copy',myEvent);
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
    event.endDate = endDate.getFullYear() + '-' + endDate.getMonth() + '-' + endDate.getDate();
    return event
  };

  // returns opposite of bool
  myService.toggle = function(bool){
    return !bool;
  };

  return myService;
}]);
