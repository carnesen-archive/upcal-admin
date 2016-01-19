'use strict';

/**
 * WebServer.js: exports a WebServer singleton object
 */

// Node.js core modules
var http = require('http');
var path = require('path');

// Installed dependencies
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

/**
 * Module variables
 */
var app = express();
var server = http.createServer(app);
const PORT = process.env.PORT || 3000;
var routes = [];

/**
 * Configure the express app
 */

// Console log all http requests
app.use(logger('dev'));

// view engine setup. Looks for "views" subdirectory in current working directory
app.set('view engine', 'jade');
app.set('views', path.join(process.cwd(), 'views'));

// Put POST data into request.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// attach error handler for http server
server.on('error', (error) => {

  if (error.syscall !== 'listen') {
    throw error;
  }

  var portString = 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {

    case 'EACCES':
      console.error(portString + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(portString + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;

  }
});

// attach "listening" handler to http server
server.on('listening', () => {
  console.log('Listening on port ' + PORT);
});

/**
 * Applies 404 and 505 catchall routes (must go last) and starts the server
 * @param done
 */
function start(done) {

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

  server.listen(app.get('port'), done);

}

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

/**
 *
 * @param route
 */
function addRoute(route) {
  app[route.method](route.path, route.handler);
  routes.push(route);
}

module.exports = {

  app,
  server,
  routes,
  addRoute,
  addStatic,
  start,
  stop

};


