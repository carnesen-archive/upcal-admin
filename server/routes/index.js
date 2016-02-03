'use strict';

var router = require('express').Router();

var C = require('../Constants');

router.get('/', function(req, res) {
  res.render('index', { title: C.name, clientID: C.oauth2.clientID });
});

module.exports = router;
