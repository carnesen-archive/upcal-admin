app.factory('ccFactory', ['$http', '$uibModal',  function($http, $uibModal){
  var myService = {};

  /*
  - gets all events with tags
  - re-formats tags array to match tag-input formatting requirements
  - re-formats dates to be javascript object dates
  - makes list of all possible tags
   */
  myService.getTable = function(){

    return $http({
      headers: {'Authorization': hello( 'google' ).getAuthResponse().access_token},
      url: '/api/events',
      method: 'get'
    }).then(function(response){
      var possibleTags = [];
      var eventList = response.data.map(function(elem){
        elem.tags = elem.tags.map(function(tag){ // tags: [{text: 'tag1'},{text: 'tag2'},{text: 'tag3'}]
          possibleTags = myService.pushTagText(tag,possibleTags);
          return {'text':tag};
        });
        elem.startDate = new moment(elem.startDate)._d;
        elem.endDate = new moment(elem.endDate)._d;
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
      headers: {'Authorization': hello( 'google' ).getAuthResponse().access_token},
      url: '/api/events/'+ event.calendarId + '/' + event.eventId,
      method: 'put',
      data: event
    }).then(function(response){
      return 'success';
    })
  };

  // posts new row into database and returns its new calendarId and eventId
  myService.postRow = function(newEvent){
    var event = Object.assign({},newEvent);
    event = myService.prepareEvent(event);
    return $http({
      headers: {'Authorization': hello( 'google' ).getAuthResponse().access_token},
      url: '/api/events',
      method: 'post',
      data: event
    }).then(function(response){
      newEvent.calendarId = response.data.calendarId;
      newEvent.eventId = response.data.eventId;
      return newEvent;
    })
  };

  // deletes event from database.
  // was replaced by "deleted" tags
  //myService.deleteRow = function(){
  //  // pass in id as data
  //  return $http({
  //    headers: {'Authorization': hello( 'google' ).getAuthResponse().access_token},
  //    url: '/api/events',
  //    method: 'delete'
  //  }).then(function(response){
  //    return response.data
  //  })
  //};


  // modal open
  myService.animationsEnabled = true;

  // open modal and pass in event info if exists
  myService.open = function (event) {

    var myEvent = Object.assign({},event); // creates copied object for editing without necessarily changing event

    // passes event info to modalCtrl
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

    // handles the case that they click ok.
    return modalInstance.result.then(function (updatedEvent) {
      return updatedEvent;
    });
  };

  // prepares event for saving in db. reverts formatting done in myService.getTable
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

  // used for pushing unique tag objects
  myService.pushTagObject = function(item,array){
    for (var i = 0 ; i < array.length ; i++){
      if (array[i].text === item.text){
        return array;
      }
    }
    array.push(item);
    return array;
  };

  // used for pushing unique tag text
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
