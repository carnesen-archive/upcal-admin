var C = require('../Constants.js');
var router = require('express').Router();

router.get('/',function(req,res,next){
  res.send({clientID: C.oauth2.clientID})
});

module.exports = router;