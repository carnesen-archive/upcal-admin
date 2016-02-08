#!/usr/bin/env node

process.env.LOG_LEVEL = 'error';

var GoogleCalendar = require('../server/clients/GoogleCalendar');

GoogleCalendar._deleteAllEvents();
