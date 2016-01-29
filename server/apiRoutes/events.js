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

module.exports = router;
