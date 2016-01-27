'use strict';

// Node.js core modules
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

// Installed modules
var async = require('async');
var mkdirp = require('mkdirp');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// Local modules
var C = require('../Constants');
var log = require('../Logger');

// Local constants
var SCOPES = [
  'https://www.googleapis.com/auth/calendar'
];
var TOKEN_DIR =  path.join(C.dataDir, 'credentials');
var TOKEN_PATH = path.join(TOKEN_DIR, 'calendar.json');
var CALENDAR = google.calendar('v3');
var CALENDAR_IDS = [
  'nt4onda377vop2r2ph07d8shig@group.calendar.google.com',
  'en.usa#holiday@group.v.calendar.google.com',
  'vvfgv249tf6u90hjc4e381g1a8@group.calendar.google.com'
];

// Module variables

mkdirp.sync(TOKEN_DIR);

/**
 * Get a token and store it in jwtClient.credentials
 */
function getToken(jwtClient, done) {

  fs.readFile(TOKEN_PATH, function (readErr, fileContents) {
    if (!readErr) {
      jwtClient.credentials = JSON.parse(fileContents);
      done();
    } else {
      // The token file doesn't exist so we need to fetch one
      jwtClient.authorize(function (authErr, token) {
        if (authErr) {
          // failed to get a token from the authorization API
          done(authErr);
        } else {
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (writeErr) {
            if (writeErr) {
              // failed to write token to TOKEN_PATH
              done(authErr);
            } else {
              log.info('Wrote Google API token to %s', TOKEN_PATH);
              jwtClient.credentials = token;
              done();
            }
          });
        }
      });
    }
  });
}

/**
 * Calls back an error or an authorized jwt client
 */
function authorize(callback) {
  var auth = new googleAuth();
  auth.fromJSON(C.googleApiCredentials, function(err, jwtClient) {
    if (err) {
      callback(err);
    } else {
      jwtClient.scopes = SCOPES;
      getToken(jwtClient, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, jwtClient);
        }
      });
    }
  });
}

function listEvents(calendarId, callback) {
  authorize(function(err, client) {
    if (err) {
      return callback(err);
    }
    var queryOpts = {
      auth: client,
      calendarId: querystring.escape(calendarId)
    };
    CALENDAR.events.list(queryOpts, function(err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    });
  });
}

function listAllEvents(callback) {
  async.map(CALENDAR_IDS, listEvents, callback)
}

function addCalendar(id, done) {
  authorize(function(err, client) {
    if (err) {
      return done(err);
    }
    var queryOpts = {
      auth: client,
      resource: {
        id: id
      }
    };
    CALENDAR.calendarList.insert(queryOpts, done);
  });
}

function addCalendars(done) {
  done = done || function() {};
  async.each(CALENDAR_IDS, addCalendar, done)
}

module.exports = {

  listEvents: listEvents,
  listAllEvents: listAllEvents,
  addCalendars: addCalendars
};
