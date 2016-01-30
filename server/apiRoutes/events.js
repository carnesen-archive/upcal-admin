'use strict';

var router = require('express').Router();


var GoogleCalendar = require('../clients/GoogleCalendar');

router.get('/events', function(req, res, next) {
    GoogleCalendar.listAllEvents(function(err, ret) {
    if (err) {
      next(new Error(err));
    } else {
      res.send(ret);
    }
  });
});

router.delete('/events', function(req, res,next) {
    var eventSpec = {
        eventId: req.query.eventId,
        calendarId: req.query.calendarId
    };
    GoogleCalendar.deleteEvent(eventSpec, function(err) {
        if (err) {
            // creates a new Error object (error is constructor) and takes a single object and passes it to the next middleware
            // links to WebServer.js error handler
            next(new Error(err));
        } else {
            res.sendStatus(200);
        }
    });
});

router.insert('/events', function(req, res, next) {
    var eventSpec = {
        eventId: req.query.eventId,
        calendarId: req.query.calendarId,
    };
    GoogleCalendar.insertEvent(eventSpec, function(err) {
        if (err) {
            next(new Error(err));
        } else {
            res.send(ret);
        }
    });
});

router.update('/events', function(req, res, next) {
    var eventSpec = {
        eventId: req.query.eventId,
        calendarId: req.query.calendarId,
    };
    GoogleCalendar.updateEvent(eventSpec, function(Err) {
        if (err) {
            next(new Error(err));
        } else {
            res.send(ret);
        }
    });
});


module.exports = router;
