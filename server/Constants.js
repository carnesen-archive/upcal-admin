'use strict';

const path = require('path');

const config = require('config');

const pkg = require('../package.json');

module.exports = {
  name: pkg.name,
  description: pkg.description,
  npmVersion: pkg.version,
  gitVersion: process.env.npm_package_gitHead,
  topDir: path.join(__dirname, '..'),
  port: process.env.port || config.get('port'),
  logLevel: config.get('logLevel')
};
