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
var GoogleStrategy = require('passport-google-oauth2').Strategy;
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

/**
 * Passport session setup
 * To support persistent login sessions, Passport needs to be able to serialize users into and deserialize out
 * of the session.  Typically this will be as simple as storing the user ID when serializing, and finding the user by ID
 * when deserializing.  However, since this example does not have a database of user records, the Google profile is
 * serialized and deserialized.
 */


/*
passport.serializeUser(function(user, done){
  done(null,user);
});
passport.deserializeUser(function (obj, done){
    done(err, obj);
});

/**
 * Use the GoogleStrategy within Passport.
 * Strategies in Passport require a 'verify' function, which accept credentials (in this case, an accessToken, refreshToken,
 * and Google profile), and invoke a callback with a user object.


passport.use(new GoogleStrategy({
  clientID: C.oauth2.clientId,
  clientSecret: C.oauth2.clientSecret,
  //NOTE: Careful and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during
  //authentication.  The workaround is to set up thru google cloud console a full qualified domain name such as http://mydomain:3000/
  //then edit your /etc/hosts local file to point on your Private IP.
  // also both sign-in button + callbackURL has to share the same url, otherwise two cookies will be created and lead to lost session.
  callbackURL:'http://localhost:3000/oauth2callback',
  passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
  //asynch verification for effect...
  process.nextTick(function () {

    // to keep this simple, the user's Google profile is returned to represent the logged-in user.  In a typical application,
    // you would want to associate the Google account with a user record in your database, and return that user instead.
    return done(null, profile);
  });
}
));

/*
app.get('/api/*', ensureAuthenticated, function(req, res){
  res.json({message: 'Hooray! welcome to our route.'});
}
);
*/
apiRoutes.forEach(function(router) {
  app.use('/api', router);
});


// log all http requests
app.use(morgan('dev', {stream: log.stream}));

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// Put POST data into request.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/*
//app.use(expressSession({
  //secret: // this requires a secret...unsure what we need here.
  // ));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
*/

// pretty print JSON responses
app.set('json spaces', 2);

// Mount routes
app.use(express.static(path.join(C.topDir, 'public')));

app.use(indexRouter);

/* route where user goes after clicking log on
app.get('/auth/google',
  passport.authenticate('google',
  {scope: ['https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email']}),
  function(req, res){} // never called
);

// call back address to tell local server whether authentication was successful.
app.get('/oauth2callback',
  passport.authenticate('google',
  {successRedirect: '/', failureRedirect: '/login'}
));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// checks if request is made by an authenticated user (used with routes to authenticate)
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) {return next();}
  res.sendStatus(401);
}
*/

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
addLib('angular-animate/angular-animate-min.js');

app.use("/lib/bootstrap/", express.static(path.join(C.topDir, 'node_modules','bootstrap','dist')));



// THIS IS FROM GOOG OAUTH2 not PASSPORT
// Configure session and session storage
// MemoryStory isn't vaiable in a multi-server configuration, so we use
// encrypted cookies.  Redis or Memcache is a great option for more secure sessions.

//app.use(session({
  //secret: C.secret,
  //signed: true
//}));

//OAuth2

//app.use(oauth2.router);


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
  stop: stop

};