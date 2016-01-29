// Angular module

// create our app. injecting ngRoute/ngTagsInput directives
var app = angular.module('unionPark', ['ngRoute','ngTagsInput']);

// routes
// when just #/ ... goes to /pages/login.html, then use loginCtrl
app.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
      templateUrl: '/pages/login.html',
      controller: 'loginCtrl'
    }). // when you have #/ccTable...use ccTable.html w/ ccTableCtrl
      when('/ccTable', {
      templateUrl: '/pages/ccTable.html',
      controller: 'ccTableCtrl'
    })
}]);

// change otherwise to 404, 500