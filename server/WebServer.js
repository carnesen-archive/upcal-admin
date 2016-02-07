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
var session = require('cookie-session');

// Local dependencies
var log = require('./Logger');
var C = require('./Constants');
var indexRouter = require('./routes/index');
var apiRoutes = require('./apiRoutes/index');
var passport = require('passport');
var GoogleTokenInfo = require('./clients/GoogleTokenInfo');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var expressSession = require('express-session');

/**
 * Module variables
 */
var app = express();
var server = http.createServer(app);
var libs = [];


/**
 * Configure the express app
 */

// moment.js
//moment().format();

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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy(C.oauth2,
  function(identifier, profile, done) {
    done(null, profile);
  }
));


// need to set resave/saveUninitalized values explicitly due to impending default changes
app.use(expressSession({secret: 'unionpark', resave: true, saveUninitialized: true}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
    //hostedDomain: 'upcal-admin.com',
    scope: C.oauth2.scopes
  })
);

app.get('/auth/google/return',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  function(req, res){
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Mount routes
app.use(express.static(path.join(C.topDir, 'public')));

// app.use('/clientInfo', clientInfo);
app.use('/',indexRouter);


function authMiddleware(req, res, next) {
  if (C.restricted) {
    var jwt = req.get('Authorization');
    if (jwt) {
      GoogleTokenInfo.verifyIdToken(jwt, function(err) {
        if (err) {
          res.sendStatus(401);
        } else {
          next();
        }
      })
    } else {
      res.sendStatus(401);
    }
  } else {
    next();
  }
}

apiRoutes.forEach(function(router) {
  app.use('/api', authMiddleware, router);
});

app.use('/api', require('./apiRoutes/clientInfo'));


function addLib(relativePath) {
  var fileName = path.basename(relativePath);
  libs.push(relativePath);
  app.get('/lib/' + fileName, function(req, res) {
    res.sendFile(path.join(C.topDir, 'node_modules', relativePath));
  });
}

addLib('angular/angular.min.js');
addLib('angular-route/angular-route.min.js');
addLib('ng-tags-input/build/ng-tags-input.min.js');
addLib('ng-tags-input/build/ng-tags-input.min.css');
addLib('bootstrap/dist/css/bootstrap.min.css');
addLib('bootstrap/dist/js/bootstrap.min.js');
addLib('angular-ui-bootstrap/dist/ui-bootstrap-tpls.js');
addLib('angular-animate/angular-animate.min.js');
addLib('hellojs/dist/hello.all.min.js');
addLib('moment/moment.js');

app.use("/lib/bootstrap/", express.static(path.join(C.topDir, 'node_modules','bootstrap','dist')));

// attach error handler for http server
server.on('error', function(error) {

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
server.on('listening', function() {
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
 * Applies 404 and 505 catchall routes (must go last) and starts the server
 * @param done
 */
function start(done) {

  done = done || function() {};

  // catch requests for non-existent routes and respond with 404 "not found"
  app.use(function(req, res) {
    res.status(404);
    res.render('404', {
      path: req.url,
      method: req.method
    });
  });

  // Internal server error
  if (C.env === 'production') {
    // no stack traces leaked to user
    app.use(function(err, req, res) {
      res.status(err.status || 500);
      res.render('500', {
        message: err.message,
        error: {}
      });
    });
  } else {
    // will print stacktrace
    app.use(function(err, req, res) {
      res.status(err.status || 500);
      res.render('500', {
        message: err.message,
        error: err
      });
    });
  }
  server.listen(C.port, done);
}

module.exports = {

  app: app,
  libs: libs,
  server: server,
  start: start,
  stop: stop,
  ensureAuthenticated: ensureAuthenticated,

};