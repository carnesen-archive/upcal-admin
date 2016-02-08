'use strict';

// installed modules
var request = require('request');

// local modules
var C = require('../Constants');

function verifyAccessToken(accessToken, done) {
  request({
    method: 'GET',
    uri: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
    qs: {
      access_token: accessToken
    },
    json: true
  }, function(err, res, json) {
    if (err) {
      done(err);
    } else {
      var email = json.email;
      if (email) {
        var domain = email.split('@')[1];
        if (domain === C.domain) {
          done();
        } else {
          done(new Error('Bad Domain ' + domain))
        }
      } else {
        done(new Error('No email present in token'));
      }
    }
  });
}

//verifyAccessToken('ya29.gQKjmyvenUyCLYIrGP68fOfFiOOpUlWuUkB5s6aDtmktjUxkx6NVUT9dIzUaX0qMXW0W', console.log)

module.exports = {
  verifyAccessToken: verifyAccessToken
};
