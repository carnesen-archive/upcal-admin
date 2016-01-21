//var request = require('supertest');

var ws = require('../WebServer');

describe('WebServer', function() {

  it('starts and stops', function(done) {

    ws.start(function() {

      ws.stop(done);

    });
  });

});