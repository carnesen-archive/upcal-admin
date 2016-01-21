'use strict';

var router = require('express').Router();

var C = require('../Constants');

router.get('/version', function(req, res) {
  res.send({
    git: C.gitVersion,
    npm: C.npmVersion
  });
});

module.exports = router;
