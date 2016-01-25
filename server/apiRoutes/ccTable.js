var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
  res.send(200, 'congratz bro get');
});

router.put('/', function(req,res){
  res.send(200, 'congratz bro put');
});

module.exports = router;