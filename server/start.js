'use strict';

var path = require('path');

var ws = require('./WebServer');

// Mount static "public" directory
ws.addStatic('/', path.join(__dirname, '..', 'public'));

// Mount static "dist" directory
ws.addStatic('/', path.join(__dirname, '..', 'dist'));

ws.start();
