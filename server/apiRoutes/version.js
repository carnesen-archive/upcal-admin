'use strict';

var router = require('express').Router();

var C = require('../Constants');

router.get('/version', (req, res) => {
  res.send({
    git: C.gitVersion,
    npm: C.npmVersion
  });
});

module.exports = router;
