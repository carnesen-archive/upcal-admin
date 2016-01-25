app.factory('ccFactory', ['$http', function($http){
  var myService = {};

  myService.getTable = function(){
    $http.get({

    })
  };




  return myService;
}]);