'use strict';

var path = require('path');

const express = require('express');

var WebServer = require('./WebServer');
const indexRoute = require('./routes/index');
const apiRoutes = require('./apiRoutes/index');
const C = require('./Constants');

// Mount static "public" directory
WebServer.app.use(express.static(path.join(C.topDir, 'public')));

// Mount static "dist" directory
WebServer.app.use(express.static(path.join(C.topDir, 'public')));

WebServer.app.use(indexRoute);

apiRoutes.forEach(router => WebServer.app.use('/api', router));

module.exports = {
  WebServer
};