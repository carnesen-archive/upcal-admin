var app = angular.module('unionPark', ['ngRoute','ngTagsInput']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
      templateUrl: '/pages/login.html',
      controller: 'loginCtrl'
    }).
      when('/ccTable', {
      templateUrl: '/pages/ccTable.html',
      controller: 'ccTableCtrl'
    })
}]);