'use strict';

var path = require('path');

var request = require('supertest');

var WebServer = require('../WebServer');

describe('WebServer', function() {

  it('starts and stops', function(done) {

    WebServer.start(function() {

      WebServer.stop(done);

    });
  });

  it('get /', function(done) {
    request(WebServer.app).get('/').expect(200, done);
  });

  it('get /lib/angular.min.js', function(done) {
    request(WebServer.app).get('/lib/angular.min.js').expect(200, done);
  });

  it('get /api/version', function(done) {
    request(WebServer.app).get('/api/version').expect(200, done);
  });

  it('404\'s on non-existent path', function(done) {
    request(WebServer.app).get('/non-existent-path').expect(404, done);
  });

  WebServer.libs.forEach(function(relativePath) {
    var fileName = path.basename(relativePath);
    it('get ' + '/lib/' + fileName, function(done) {
      request(WebServer.app).get('/lib/' + fileName).expect(200, done);
    })
  });

});