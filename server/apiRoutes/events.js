'use strict';

var async = require('async');
var router = require('express').Router();

var GoogleDatastore = require('../clients/GoogleDatastore');
var GoogleCalendar = require('../clients/GoogleCalendar');

router.get('/events', function (req, res, next) {

  var calls = {
    calendarEvents: GoogleCalendar.listAllEvents,
    datastoreEvents: GoogleDatastore.listAllEvents
  };

  async.parallel(calls, callback);

  function callback(err, ret) {

    if (err) {
      next(new Error(err));
    } else {

      // For each calender event, find a matching datastore event if it exists
      var joinedEvents = ret.calendarEvents.map(function(calendarEvent) {

        // match function: returns true if there's a matching event, false otherwise
        function isMatch(datastoreEvent) {
          return datastoreEvent.calendarId === calendarEvent.calendarId
            && datastoreEvent.eventId === calendarEvent.eventId;
        }

        var matchedDatastoreEvents = ret.datastoreEvents.filter(isMatch);

        // if there's not an event in the datastore that matches the calendar event
        if (matchedDatastoreEvents.length === 0) {
          // insert default tags into datastore
          GoogleDatastore.insertEvent(calendarEvent);
        } else {
          // set tags field of calender event to those found in the datastore
          calendarEvent.tags = matchedDatastoreEvents[0].tags;
        }

        return calendarEvent;

      });

      res.send(joinedEvents);

    }
  }

});

router.delete('/events/:calendarId/:eventId', function (req, res, next) {
  res.sendStatus(200);
  //GoogleCalendar.deleteEvent(eventSpec, function (err) {
  //  if (err) {
  //    // creates a new Error object (error is constructor) and takes a single object and passes it to the next middleware
  //    // links to WebServer.js error handler
  //    next(new Error(err));
  //  } else {
  //    res.sendStatus(200);
  //  }
  //});
});

router.post('/events', function (req, res, next) {
  res.send({
    calendarId: Date.now(),
    eventId: Date.now()
  });
  //GoogleCalendar.insertEvent(eventSpec, function (err) {
  //  if (err) {
  //    next(new Error(err));
  //  } else {
  //    res.send(ret);
  //  }
  //});
});

router.put('/events/:calendarId/:eventId', function (req, res, next) {
  res.sendStatus(200);
  //GoogleCalendar.updateEvent(eventSpec, function (Err) {
  //  if (err) {
  //    next(new Error(err));
  //  } else {
  //    res.send(ret);
  //  }
  //});
});


module.exports = router;
