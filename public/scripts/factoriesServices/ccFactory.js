app.factory('ccFactory', ['$http', function($http){
  var myService = {};

  // get table from database
  myService.getTable = function(){
    return $http({
      url: '/api/events',
      method: 'get'
    }).then(function(response){
      var array = [];
      console.log('get response', response);
      for (var i = 0 ; i <20 ; i++){
        array.push(response.data[i])
      }
      var eventList = array.map(function(elem){
        elem.tags = elem.tags.map(function(tag){
          return {'text':tag};
        });
        elem.startDate = new Date(elem.startDate);
        elem.endDate = new Date(elem.endDate);
        return elem
      });

      return eventList;
    })
  };

  // update table in database
  myService.putRow = function(){
    return $http({
      url: '/api/events',
      method: 'put'
    }).then(function(response){
      console.log('put response', response)
    })
  };

  myService.postRow = function(){
    return $http({
      url: '/api/events',
      method: 'post'
    }).then(function(response){
      console.log('put response', response)
    })
  };

  myService.deleteRow = function(){
    return $http({
      url: '/api/events',
      method: 'delete'
    }).then(function(response){
      console.log('put response', response)
    })
  };


  // returns opposite of bool
  myService.toggle = function(bool){
    return !bool;
  };



  return myService;
}]);
