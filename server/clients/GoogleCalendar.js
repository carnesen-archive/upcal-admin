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
var CALENDARS = [
  {
    name: 'National Health Observances',
    id: 'nt4onda377vop2r2ph07d8shig@group.calendar.google.com',
    tags: [
      'health',
      'observances'
    ]
  },
  {
    name: 'US Holidays',
    id: 'en.usa#holiday@group.v.calendar.google.com',
    tags: [
      'holidays'
    ]
  },
  {
    name: 'Fashion Week',
    id: 'vvfgv249tf6u90hjc4e381g1a8@group.calendar.google.com',
    tags: [
      'fashion',
      'luxury'
    ]
  }
];

// Module variables
var calendarClient = google.calendar('v3');

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

function transformRawEvent(event) {
  return {
    id: event.id,
    htmlLink: event.htmlLink,
    summary: event.summary,
    description: event.description,
    location: event.location,
    startDate: event.start.date,
    endDate: event.end.date
  }
}

function transformRawCalendar(spec, data) {
  return Object.assign({}, spec, {
    summary: data.summary,
    description: data.description,
    events: data.items.map(transformRawEvent)
  });
}

function listEvents(spec, callback) {
  authorize(function(err, client) {
    if (err) {
      return callback(err);
    }
    var queryOpts = {
      auth: client,
      calendarId: querystring.escape(spec.id)
    };
    calendarClient.events.list(queryOpts, function(err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, transformRawCalendar(spec, response));
      }
    });
  });
}

function listAllEvents(callback) {
  async.map(CALENDARS, listEvents, callback)
}

function addCalendar(spec, done) {
  authorize(function(err, client) {
    if (err) {
      return done(err);
    }
    var queryOpts = {
      auth: client,
      resource: {
        id: spec.id
      }
    };
    calendarClient.calendarList.insert(queryOpts, done);
  });
}

function addCalendars(done) {
  done = done || function() {};
  async.each(CALENDARS, addCalendar, done)
}

module.exports = {

  listEvents: listEvents,
  listAllEvents: listAllEvents,
  addCalendars: addCalendars
};
