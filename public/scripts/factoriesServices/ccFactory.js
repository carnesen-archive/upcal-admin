app.factory('ccFactory', ['$http', function($http){
  var myService = {};

  // get table from database
  myService.getTable = function(){
    $http.get({
      url: '/ccTable',
      method: 'get'
    }).then(function(response){
      console.log('get response', response);
      return response.data;
    })
  };

  // update table in database
  myService.putTable = function(){
    $http.get({
      url: '/ccTable',
      method: 'put'
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