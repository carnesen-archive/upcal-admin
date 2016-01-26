var express = require('express');
var router = express.Router();
var knex = require('knex');

router.get('/',function(req,res){ //go into db and get
 /*
  knex('cues')
  .select('name', 'status', 'start_date', 'end_date').orderBy('start_date', 'asc')
  .join('tags', 'cue.id', '=', 'tag.id') // joins tag table. 1st join argument/join operator/second join argument
  .limit(25).offset(0)
  .then(function(result){
 response.json(result);
 })
  */
  res.send(200, 'congratz bro get');
});

//pagination https://github.com/tgriesser/bookshelf/issues/435


router.put('/', function(req,res){
  res.send(200, 'congratz bro put');
});

//manual router put insert data

//delete route (in database switch status field)

module.exports = router;