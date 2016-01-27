var express = require('express');
var router = express.Router();
var glcoud = require('gcloud');

router.get('/',function(req,res){ //go into db and get
  res.send(200, 'congratz bro get');
});



router.put('/', function(req,res){
  res.send(200, 'congratz bro put');
});


module.exports = router;


/** datastore syntax

 router.post

 // save data to database (from form or new tag addition)
 var data = req.body;
 model.create(data, function(err, savedData){
 if(err) {return handleRpcError(err, res); }
 res.redirect(req.baseUrl + '/' + savedData.id);


 gcloud models
