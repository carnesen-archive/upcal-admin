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

var tokenDir = path.join(dataDir, 'tokens');

mkdirp.sync(tokenDir);

var env = process.env.NODE_ENV || 'development';

var googleApiCredentials = {
  type: 'service_account',
  private_key: process.env.GOOGLE_API_PRIVATE_KEY || 'no key provided',
  client_email: process.env.GOOGLE_API_CLIENT_EMAIL || 'no email provided'
};

var port = process.env.PORT || 3000;

var baseUrl = process.env.BASE_URL || 'http://localhost:' + port;

module.exports = {
  name: name,
  description: pkg.description,
  npmVersion: pkg.version,
  gitVersion: process.env.npm_package_gitHead,
  topDir: topDir,
  port: port,
  logLevel: process.env.LOG_LEVEL || 'debug',
  googleApiCredentials: googleApiCredentials,
  oauth2: {
    clientID: process.env.GOOGLE_API_CLIENT_ID || 'no client id provided',
    clientSecret: process.env.GOOGLE_API_CLIENT_SECRET || 'no secret provided',
    callbackURL: baseUrl + '/auth/google/callback',
    realm: baseUrl + '/',
    scopes: [ 'profile', 'email' ]
  },
  env: env,
  gcloud: {
    projectId: 'driven-density-120118',
    credentials: googleApiCredentials
  },
  secret: process.env.GOOGLE_API_CLIENT_SECRET,
  cloudStorageBucket: 'driven-density-120118',
  dataDir: dataDir,
  tokenDir: tokenDir
};
