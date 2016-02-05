'use strict';
var express = require('express');
var C = require('../Constants.js');
var router = express.Router();

router.get('/clientInfo',function(req,res){
  res.send({clientID: C.oauth2.clientID})
});

module.exports = router;