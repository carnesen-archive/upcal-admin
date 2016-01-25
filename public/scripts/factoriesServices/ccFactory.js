app.factory('ccFactory', ['$http', function($http){
  var myService = {};

  myService.getTable = function(){
    $http.get({
      url: '/ccTable',
      method: 'get'
    }).then(function(response){
      console.log('get response', response);
      return response.data;
    })
  };

  myService.putTable = function(){
    $http.get({
      url: '/ccTable',
      method: 'put'
    }).then(function(response){
      console.log('put response', response)
    })
  };



  return myService;
}]);