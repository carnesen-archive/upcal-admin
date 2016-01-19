'use strict';

const config = require('config');

module.exports = {
  port: process.env.port || config.get('port'),
  logLevel: config.get('logLevel')
};
