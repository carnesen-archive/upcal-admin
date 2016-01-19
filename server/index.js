var path = require('path');

var WebServer = require('./WebServer');

// Mount static "public" directory
WebServer.addStatic('/', path.join(__dirname, '..', 'public'));

// Mount static "dist" directory
WebServer.addStatic('/', path.join(__dirname, '..', 'dist'));

module.exports = {
  WebServer
};