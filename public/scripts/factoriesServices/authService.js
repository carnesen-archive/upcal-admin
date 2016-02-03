app.service('authService', ['$window', '$q', function ($window, $q) {

  var self = this;
  this.user = {};
  var defer = $q.defer();

  // This exposes the user object as a promise.
  // First two arguments of then are success and error callbacks, third one is notify callback.
  this.getUser = function () {
    self.setUser();
    return self.user;
  };

  this.observeUser = function() {
    return defer.promise;
  };

  this.setUser = function () {
    self.user = self.parseJwt(self.getToken());
    defer.notify(self.user);
  };

  this.parseJwt = function (token) {
    if (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    } else return {};
  };

  this.saveToken = function (token) {
    $window.localStorage.jwtToken = token;
    self.setUser();
  };

  this.getToken = function () {
    return $window.localStorage.jwtToken;
  };

  this.isAuthed = function () {
    var token = this.getToken();
    if (token) {
      var params = self.parseJwt(token);
      var notExpired = Math.round(new Date().getTime() / 1000) <= params.exp;

      // if the user is expired, log them out
      if (!notExpired) {
        self.logout();
      }
      return notExpired;
    } else {
      return false;
    }
  };

  this.logout = function () {
    delete $window.localStorage.jwtToken;
    self.setUser();
  };
}]);