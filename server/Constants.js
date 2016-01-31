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

var googleApiCredentials = {
  type: 'service_account',
  private_key: process.env.GOOGLE_API_PRIVATE_KEY || 'no key provided',
  client_email: process.env.GOOGLE_API_CLIENT_EMAIL || 'no email provided'
};

module.exports = {
  name: name,
  description: pkg.description,
  npmVersion: pkg.version,
  gitVersion: process.env.npm_package_gitHead,
  topDir: topDir,
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  googleApiCredentials: googleApiCredentials,
  oauth2: {
    clientId: process.env.GOOGLE_API_CLIENT_ID || 'no client id provided',
    clientSecret: process.env.GOOGLE_API_CLIENT_SECRET || 'no secret provided',
    redirectUrl: process.env.OAUTH2_CALLBACK || 'http://localhost:3000/oauth2callback',
    scopes: ['email', 'profile']
  },
  env: env,
  gcloud: {
    projectId: 'driven-density-120118',
    credentials: googleApiCredentials
  },
  secret: process.env.GOOGLE_API_CLIENT_SECRET,
  cloudStorageBucket: 'driven-density-120118',
  dataDir: dataDir
};
