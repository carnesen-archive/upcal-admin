'use strict';

const path = require('path');

const config = require('config');

const pkg = require('../package.json');

module.exports = {
  name: pkg.name,
  topDir: path.join(__dirname, '..'),
  port: process.env.port || config.get('port'),
  logLevel: config.get('logLevel')
};
