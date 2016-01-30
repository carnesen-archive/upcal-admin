app.factory('ccFactory', ['$http', function($http){
  var myService = {};

  // get table from database
  myService.getTable = function(){
    return $http({
      url: '/api/events',
      method: 'get'
    }).then(function(response){
      console.log('get response', response);
      return response.data;
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


  // pull list of tags
  myService.getTags = function(){
    $http.get({
      url: '/tags',
      method: 'get'
    }).then(function(response){
      console.log('put response', response);
      return response.data;
    })
  };

  // returns opposite of bool
  myService.toggle = function(bool){
    return !bool;
  };



  return myService;
}]);
