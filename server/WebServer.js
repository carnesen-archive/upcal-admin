'use strict';

/**
 * WebServer.js: exports a WebServer singleton object
 */

// Node.js core modules
var http = require('http');
var path = require('path');

// Installed dependencies
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var initializeSwagger = require('swagger-tools').initializeMiddleware;


// Local dependencies
const log = require('./Logger');
const C = require('./Constants');

/**
 * Module variables
 */
var app = express();
var server = http.createServer(app);
var paths = {};

/**
 * Configure the express app
 */

// log all http requests
app.use(morgan('dev', {stream: log.stream}));

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// Put POST data into request.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// pretty print JSON responses
app.set('json spaces', 2);

// attach error handler for http server
server.on('error', (error) => {

  if (error.syscall !== 'listen') {
    throw error;
  }

  var portString = 'Port ' + C.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {

    case 'EACCES':
      log.error(portString + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      log.error(portString + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;

  }
});

// attach "listening" handler to http server
server.on('listening', () => {
  log.info('Listening on port ' + C.port);
});

/**
 * Stops the http server
 * @param done
 */
function stop(done) {
  server.close(done);
}

/**
 *
 * @param url
 * @param path
 */
function addStatic(url, path) {
  app.use(url, express.static(path));
}

const swaggerSpec = {
  swagger: '2.0',
  info: {
    description: C.description,
    version: C.gitVersion,
    title: C.name
  },
  basePath: C.apiBasePath,
  schemes: ['http'],
  paths: paths
};

/**
 *
 * @param route
 */
function addApiRoute(route) {
  app[route.method](C.apiBasePath + route.path, route.handler);
  if (!(route.path in paths)) {
    paths[route.path] = {};
  }

  paths[route.path][route.method] = {
    description: route.description || '',
    summary: route.summary || '',
    parameters: route.parameters || [],
    produces: ['application/json'],
    responses: route.responses
  };
}

function addRoute(route) {
  app[route.method](route.path, route.handler);
}

/**
 * Applies 404 and 505 catchall routes (must go last) and starts the server
 * @param done
 */
function start(done) {

  done = done || function() {};

  initializeSwagger(swaggerSpec, swaggerMiddleware => {
    app.use(swaggerMiddleware.swaggerUi({apiDocs: '/api/swagger'}));

    // catch requests for non-existent routes and respond with 404 "not found"
    app.use((req, res) => {
      res.status(404);
      res.render('404', {
        path: req.url,
        method: req.method
      });
    });

    // Internal server error
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render('500', {
        message: err.message,
        error: err
      });
    });

    server.listen(C.port, done);
  });

}

module.exports = {

  app,
  server,
  addApiRoute,
  addRoute,
  addStatic,
  start,
  stop

};


