#!/usr/bin/env node

process.env.LOG_LEVEL = 'error';

var GoogleDatastore = require('../server/clients/GoogleDatastore');

GoogleDatastore._deleteAll();
