//var request = require('supertest');

var ws = require('../WebServer');

describe('WebServer', () => {

  it('starts and stops', (done) => {

    ws.start(() => {

      ws.stop(done);

    });
  });

});