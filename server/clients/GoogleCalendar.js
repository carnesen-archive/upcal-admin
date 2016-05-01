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
var CALENDAR_CLIENT = googleapis.calendar('v3');
var TOKEN_DIR = path.join(C.dataDir, 'credentials');
var TOKEN_PATH = path.join(TOKEN_DIR, 'calendar.json');
var PRIMARY_CALENDAR_SPEC = {
  id: 'primary',
  name: 'Primary calendar for the upcal admin service user',
  tags: [ 'Added' ]
};

/** ADD CALENDAR TO APPLICATION
 *
 * Follow the json format below.
 * "name" is the Calendar Name
 * "id" is the Google Calendar ID
 * "tags" are any tags you want to automatically add to any events associated with calendar.
 *
 * To add new calendar's to a google calendar: https://support.google.com/calendar/answer/37100?hl=en
 * To find a calendar's ID: https://support.appmachine.com/hc/en-us/articles/203645966-Find-your-Google-Calendar-ID-for-the-Events-block
 *
 * For example:
 * {
 *  name: 'Minnesota Twins',
 *  id: 'ki6fjf5j1ocfavod017v6q43077gt2vu@import.calendar.google.com',
 *  tags: ['baseball', 'sports']
 * }
 *
 */
var calendarSpecs = [
  {
    id: 'nt4onda377vop2r2ph07d8shig@group.calendar.google.com',
    tags: [ 'Health', 'Observances' ]
  },
  {
    id: 'en.usa#holiday@group.v.calendar.google.com',
    tags: [ 'Holidays', 'Nationwide' ]
  },
  {
    id: 'vvfgv249tf6u90hjc4e381g1a8@group.calendar.google.com',
    tags: [ 'Fashion', 'Luxury' ]
  }
];

function fetchCalendarMetadata(done) {
  authorize(function (err, client) {
    if (err) {
      return done(err);
    }
    var queryOpts = {
      auth: client
    };
    CALENDAR_CLIENT.calendarList.list(queryOpts, function (err, ret) {
      if (err) {
        return done(err);
      }
      calendarSpecs.forEach(function(calendarSpec) {
        var matchingCalendar = ret.items.find(function(item){
          return item.id === calendarSpec.id;
        }) || {};
        calendarSpec.name = matchingCalendar.summary;
      });
    });
  });
}

fetchCalendarMetadata(function (err) {
  if (err) {
    log.error('Problem fetching calendar metadata', err);
  }
});

mkdirp.sync(TOKEN_DIR);

/**
 * Get a token from the Google Auth servers and store it in jwtClient.credentials
 * @param jwtClient
 * @param done
 */
function getToken(jwtClient, done) {

  // Read the token file from the TOKEN_DIR directory
  fs.readFile(TOKEN_PATH, function (readErr, fileContents) {
    // Here we assume that a read error just means the token file doesn't exist yet
    if (!readErr) {
      // No read error so parse the token file and set credentials
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

function toEvent(calendarSpec, event) {
  var tags = [].concat.apply([], calendarSpec.tags);
  if (event.location) {
    tags.push(event.location.split(',')[0].replace(' ', '_', 'g'));
  }
  if (event.summary && event.summary.search(/[Hh]eart/) > -1) {
    tags.push('Heart');
  }
  return {
    eventId: event.id,
    calendarId: calendarSpec.id,
    calendarName: calendarSpec.name,
    htmlLink: event.htmlLink,
    summary: event.summary,
    description: event.description,
    location: event.location,
    startDate: event.start.date || event.start.dateTime,
    endDate: event.end.date || event.end.dateTime,
    tags: tags
  }
}
/**
 * Transforms the raw data coming from the Google Calendar API
 * @param calendarSpec
 * @param data
 * @returns {*}
 */
function transformRawCalendar(calendarSpec, data) {
  return data.items.map(function(item) {
    return toEvent(calendarSpec, item);
  });
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
      calendarId: querystring.escape(calendarSpec.id),
      timeMin: new Date().toISOString()
    };
    // calendarClient is what communicates with google api
    // must pass in an authorized JWT in order to get data back
    CALENDAR_CLIENT.events.list(queryOpts, function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, transformRawCalendar(calendarSpec, response));
      }
    });
  });
}

function toResource(event) {
  return {
    summary: event.summary,
    description: event.description,
    start: {
      date: event.startDate,
      timeZone: 'America/Chicago'
    },
    end: {
      date: event.endDate,
      timeZone: 'America/Chicago'
    }
  }
}

function insertEvent(event, callback) {

  authorize(function (err, client) {

    if (err) {
      return callback(err);
    } else {

      var queryOpts = {
        auth: client,
        calendarId: 'primary',
        resource: toResource(event)
      };

      CALENDAR_CLIENT.events.insert(queryOpts, function (err, ret) {
        if (err) {
          callback(err);
        } else {
          callback(null, toEvent(PRIMARY_CALENDAR_SPEC, ret));
        }
      });
    }
  });
}

function updateEvent(event, done) {
  authorize(function (err, client) {
    if (err) {
      return done(err);
    }
    var queryOpts = {
      auth: client,
      calendarId: querystring.escape(event.calendarId),
      eventId: querystring.escape(event.eventId),
      resource: toResource(event)
    };
    CALENDAR_CLIENT.events.update(queryOpts, function(err) {
      if (err) {
        done(err);
      } else {
        done(null);
      }
    });
  });
}

// list all events in all calendars
function listAllEvents(callback) {
  var allCalendarSpecs = calendarSpecs.concat(PRIMARY_CALENDAR_SPEC);
  async.map(allCalendarSpecs, listEvents, function (err, ret) {
    if (err) {
      callback(err);
    } else {
      // takes array of arrays and puts all elements into one array
      callback(null, [].concat.apply([], ret));
    }
  });
}

function _deleteAllEvents(callback) {
  callback = callback || function() {}
  log.error('Deleting all calendar items');
  authorize(function (err, client) {
    if (err) {
      return callback(err);
    }
    CALENDAR_CLIENT.events.list({
      auth: client,
      calendarId: 'primary'
    }, function (err, response) {
      if (err) {
        callback(err);
      } else {
        async.each(response.items, function(item, done) {
          log.error(item.id);
          CALENDAR_CLIENT.events.delete({
            auth: client,
            calendarId: 'primary',
            eventId: item.id
          }, done);
        }, callback);
      }
    });
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
    CALENDAR_CLIENT.calendarList.insert(queryOpts, done);
  });
}

function addCalendars(done) {
  done = done || function () {};
  async.each(calendarSpecs, addCalendar, done)
}

module.exports = {
  insertEvent: insertEvent,
  updateEvent: updateEvent,
  _deleteAllEvents: _deleteAllEvents,
  listEvents: listEvents,
  listAllEvents: listAllEvents,
  addCalendars: addCalendars
};
