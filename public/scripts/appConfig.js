var app = angular.module('unionPark', ['ngRoute']);

console.log(app);
app.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function ($routeProvider, $locationProvider, $httpProvider) {
    console.log('this is your console.log');
    $routeProvider.when('/', {
      templateUrl: './login',
      controller: 'loginCtrl'
    }).
      when('/ccTable', {
      templateUrl: './ccTable',
      controller: 'ccTable'
    })
}]);