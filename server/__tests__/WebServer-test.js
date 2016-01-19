var request = require('supertest');

process.env.PORT = 34031;

var ws = require('../WebServer');

describe('WebServer', () => {

  it('starts and stops', (done) => {

    ws.start(() => {

      ws.stop(done);

    });
  });

  ws.routes.forEach(route => {
    it(route.method + ' ' + route.path, (done) => {
      request(ws.app)[route.method](route.path).expect(200, done);
    });
  });

});