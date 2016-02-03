'use strict';

// Node.js core modules
var path = require('path');
var fs = require('fs');

// Installed modules
var googleAuth = require('google-auth-library');

// Local modules
var C = require('../Constants');

// Local constants

var TOKEN_PATH = path.join(C.tokenDir, 'tokeninfo.json');

function getToken(jwtClient, done) {

  // Read the token file from the TOKEN_DIR directory
  fs.readFile(TOKEN_PATH, function (readErr, fileContents) {
    // Here we assume that a read error just means the token file doesn't exist yet
    if (!readErr) {
      // No read error so parse the token file and set credentials
      jwtClient.credentials = JSON.parse(fileContents);
      done();
    } else {
      // The token file doesn't exist so we need to fetch one
      jwtClient.authorize(function (authErr, token) {
        if (authErr) {
          // failed to get a token from the authorization API
          done(authErr);
        } else {
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (writeErr) {
            if (writeErr) {
              // failed to write token to TOKEN_PATH
              done(writeErr);
            } else {
              jwtClient.credentials = token;
              done();
            }
          });
        }
      });
    }
  });
}

/**
 * Calls back an error or an authorized jwt client
 */
function authorize(callback) {
  var auth = new googleAuth();
  auth.fromJSON(C.googleApiCredentials, function (err, jwtClient) {
    if (err) {
      callback(err);
    } else {
      jwtClient.scopes = C.oauth2.scopes;
      getToken(jwtClient, function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null, jwtClient);
        }
      });
    }
  });
}

function verifyIdToken(idToken, done) {
  authorize(function(err, jwtClient) {
    if (err) {
      done(err);
    } else {
      jwtClient.verifyIdToken(idToken, C.oauth2.clientID, done);
    }
  })
}

verifyIdToken('foo', console.log);

module.exports = {
  verifyIdToken: verifyIdToken
};
