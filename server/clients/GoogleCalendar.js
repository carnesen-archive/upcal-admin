'use strict';

// Node.js core modules
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

// Installed modules
var async = require('async');
var mkdirp = require('mkdirp');
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');

// Local modules
var C = require('../Constants');
var log = require('../Logger');

// Local constants
var SCOPES = [
  'https://www.googleapis.com/auth/calendar'
];
var TOKEN_DIR = path.join(C.dataDir, 'credentials');
var TOKEN_PATH = path.join(TOKEN_DIR, 'calendar.json');
var CALENDAR_SPECS = [
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
var calendarClient = googleapis.calendar('v3');

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
              done(writeErr);
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
  auth.fromJSON(C.googleApiCredentials, function (err, jwtClient) {
    if (err) {
      callback(err);
    } else {
      jwtClient.scopes = SCOPES;
      getToken(jwtClient, function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null, jwtClient);
        }
      });
    }
  });
}

function transformRawCalendar(calendarSpec, data) {
  function transformRawEvent(event) {
    return {
      id: event.id,
      calendarId: calendarSpec.id,
      htmlLink: event.htmlLink,
      summary: event.summary,
      description: event.description,
      location: event.location,
      startDate: event.start.date,
      endDate: event.end.date,
      tags: calendarSpec.tags
    }
  }

  return data.items.map(transformRawEvent);
}


// list all events in one calendar
function listEvents(calendarSpec, callback) {
  // checks for token authorization before it can execute the remaining part of function
  authorize(function (err, client) {
    if (err) {
      return callback(err);
    }
    // queryOpts takes 2 properties, the JWTclient and the calendarId
    var queryOpts = {
      auth: client,
      calendarId: querystring.escape(calendarSpec.id)
    };
    // calendarClient is what communicates with google api
    // must pass in an authorized JWT in order to get data back
    calendarClient.events.list(queryOpts, function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, transformRawCalendar(calendarSpec, response));
      }
    });
  });
}

function deleteEvent(calendarId, eventId, callback) {
  authorize(function (err, client) {
    if (err) {
      return callback(err);
    }
    var queryOpts = {
      auth: client,
      calendarId: querystring.escape(calendarId),
      eventId: querystring.escape(eventId)
    };
    calendarClient.events.delete(queryOpts, function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, transformRawCalendar(calendarSpec, response));
      }
    });
  });
}

function insertEvent(calendarId, callback) {
  authorize(function (err, client) {
    if (err) {
      return callback(err);
    }
    var queryOpts = {
      auth: client,
      calendarId: querystring.escape(calendarId)
    };
    calendarClient.events.insert(queryOpts, function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, transformRawCalendar(calendarSpec, response));
      }
    });
  });
}

function updateEvent(eventSpec, callback) {
  authorize(function (err, client) {
    if (err) {
      return callback(err);
    }
    var queryOpts = {
      auth: client,
      calendarId: querystring.escape(calendarId),
      eventId: querystring.escape(eventId)
    };
    calendarClient.events.update(queryOpts, function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, transformRawCalendar(eventSpec, response));
      }
    });
  });
}

// list all events in all calendars
function listAllEvents(callback) {
  // async is a library that allows us to map an asynchronous function onto each element in the listEvents array
  async.map(CALENDAR_SPECS, listEvents, function (err, ret) {
    if (err) {
      callback(err);
    } else {
      // takes array of arrays and puts all elements into one array
      callback(null, [].concat.apply([], ret));
    }
  });
}

function addCalendar(calendarSpec, done) {
  authorize(function (err, client) {
    if (err) {
      return done(err);
    }
    var queryOpts = {
      auth: client,
      resource: {
        id: calendarSpec.id
      }
    };
    calendarClient.calendarList.insert(queryOpts, done);
  });
}

function addCalendars(done) {
  done = done || function () {};
  async.each(CALENDAR_SPECS, addCalendar, done)
}

module.exports = {
  deleteEvent: deleteEvent,
  insertEvent: insertEvent,
  updateEvent: updateEvent,
  listEvents: listEvents,
  listAllEvents: listAllEvents,
  addCalendars: addCalendars
};
