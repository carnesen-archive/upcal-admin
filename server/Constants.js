'use strict';

var path = require('path');

var mkdirp = require('mkdirp');

var pkg = require('../package.json');
require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
  silent: true
});

var name = pkg.name;

var dataDir = path.join(process.env.DATA_DIR || process.env.HOME ||
  process.env.HOMEPATH || process.env.USERPROFILE, '.' + name);

mkdirp.sync(dataDir);

var env = process.env.NODE_ENV || 'development';

var googleApiCredentials;

// Credentials aren't necessarily present in dev and test environments
try {
  googleApiCredentials = JSON.parse(process.env.GOOGLE_API_CREDENTIALS);
} catch (err) {
  if (env === 'production') {
    throw err;
  }
}

module.exports = {
  name: name,
  description: pkg.description,
  npmVersion: pkg.version,
  gitVersion: process.env.npm_package_gitHead,
  topDir: path.join(__dirname, '..'),
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  googleApiCredentials: googleApiCredentials,
  env: env,
  dataDir: dataDir
};
