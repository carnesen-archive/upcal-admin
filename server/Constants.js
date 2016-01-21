'use strict';

var path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
  silent: true
});

var pkg = require('../package.json');

module.exports = {
  name: pkg.name,
  description: pkg.description,
  npmVersion: pkg.version,
  gitVersion: process.env.npm_package_gitHead,
  topDir: path.join(__dirname, '..'),
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  googleApiKey: process.env.GOOGLE_API_KEY,
  node_env: process.env.NODE_ENV || 'development'
};
