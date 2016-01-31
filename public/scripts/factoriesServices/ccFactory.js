app.factory('ccFactory', ['$http', function($http){
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
    // put a single row to server
    // reverse tags arrays back to just text format {tags:['tag1', 'tag2', 'tag3']}
    // return 'tag1' see line 19

    // return array of tag names as strings
    currentEvent.tags = currentEvent.tags.map(function(tag) {
      return tag.text;
    });

    // change javascript dates "currentEvent.startDate","currentEvent.endDate"
    // to string format: '2015-5-31'

    return $http({
      url: '/api/events',
      method: 'put'
    }).then(function(response){
      var possibleTags = [];
      console.log('put response', response);

      return response.data;
    })
  };

  myService.postRow = function(){
    return $http({
      url: '/api/events',
      method: 'post'
    }).then(function(response){
      console.log('put response', response);
      return response.data
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


  // returns opposite of bool
  myService.toggle = function(bool){
    return !bool;
  };



  return myService;
}]);
