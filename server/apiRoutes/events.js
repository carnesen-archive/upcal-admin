'use strict';

var async = require('async');
var router = require('express').Router();

var GoogleDatastore = require('../clients/GoogleDatastore');
var GoogleCalendar = require('../clients/GoogleCalendar');

router.get('/events', function (req, res, next) {

  var calls = {
    calendarEvents: GoogleCalendar.listAllEvents, // calls this function and stores it as property of GoogleCalendar
    datastoreEvents: GoogleDatastore.listAllEvents // is the result of calling ret.CalendarEvents
  };

  async.parallel(calls, callback);

  function callback(err, ret) {

    if (err) {
      next(new Error(err));
    } else {
      // this function is called once per element in the calendarEvents array

      // For each calender event, find a matching datastore event if it exists, ret.datastore is an array
      var joinedEvents = ret.calendarEvents.map(function(calendarEvent) {

        // match function: returns true if there's a matching event, false otherwise
        function isMatch(datastoreEvent) {
          return datastoreEvent.calendarId === calendarEvent.calendarId
            && datastoreEvent.eventId === calendarEvent.eventId;
        }
        // matchedDataStoreEvents should only contain 0 or 1 dataStoreEvent items
        // if we don't find a match, then we need to add in the default tags
        var matchedDatastoreEvents = ret.datastoreEvents.filter(isMatch);

        // if there's not an event in the datastore that matches the calendar event
        if (matchedDatastoreEvents.length === 0) {
          // insert default tags into datastore
          GoogleDatastore.insertEvent(calendarEvent);
        } else {
          // if we did find a matching event, set tags to the default tags in the calendar
          // set tags field of calender event to those found in the datastore
          calendarEvent.tags = matchedDatastoreEvents[0].tags;
        }

        return calendarEvent;

      });

      res.send(joinedEvents);

    }
  }

});

router.post('/events', function (req, res, next) {
  GoogleCalendar.insertEvent(req.body, function (err, ret) {
    if (err) {
      next(new Error(err));
    } else {
      GoogleDatastore.insertEvent(ret);
      res.send(ret);
    }
  });
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
