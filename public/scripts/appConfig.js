// Angular module

// create our app. injecting ngRoute/ngTagsInput directives
var app = angular.module('unionPark', ['ngRoute', 'ui.bootstrap', 'ngTagsInput']);
//
//'ngAnimate',

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

Array.prototype.pushUnique = function (item){
  if(this.indexOf(item) == -1) {
    //if(jQuery.inArray(item, this) == -1) {
    this.push(item);
    return true;
  }
  return false;
};

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}