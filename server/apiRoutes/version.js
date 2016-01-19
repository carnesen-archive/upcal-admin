'use strict';

var C = require('../constants');

var route = {
  path: '/version',
  method: 'get'
};

route.responses = {
  200: {
    description: 'Returns version information about this program',
    schema: {
      type: 'object',
      properties: {
        git: {
          type: 'string',
          format: 'hex'
        },
        npm: {
          type: 'string',
          format: 'semver'
        }
      }
    }
  }
};


route.handler = function(req, res) {
  res.send({
    git: C.gitVersion,
    npm: C.npmVersion
  });
};


module.exports = route;