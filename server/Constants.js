'use strict';

var path = require('path');

var mkdirp = require('mkdirp');

var pkg = require('../package.json');
require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
  silent: true
});

var name = pkg.name;

var topDir = path.join(__dirname, '..');

var dataDir = path.join(process.env.DATA_DIR || process.env.HOME ||
  process.env.HOMEPATH || process.env.USERPROFILE, '.' + name);

mkdirp.sync(dataDir);

var env = process.env.NODE_ENV || 'development';

module.exports = {
  name: name,
  description: pkg.description,
  npmVersion: pkg.version,
  gitVersion: process.env.npm_package_gitHead,
  topDir: topDir,
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  googleApiCredentials: {
    type: 'service_account',
    private_key: process.env.GOOGLE_API_PRIVATE_KEY || 'no key provided',
    client_email: process.env.GOOGLE_API_CLIENT_EMAIL || 'no email provided'
  },
  env: env,
  dataDir: dataDir
};
