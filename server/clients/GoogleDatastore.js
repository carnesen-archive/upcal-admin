'use strict';

var gcloud = require('gcloud');

var C = require('../Constants');

var dataset = gcloud.datastore.dataset(C.gcloud);

var KIND = 'Event';

function listAllEvents(callback) {
  var q = dataset.createQuery([KIND]);

  dataset.runQuery(q, function(err, entities) {
    if (err) {
      callback(err);
    }
    callback(null, entities);
  });
}


var sampleEvent = {
  eventId: 'bar',
  calendarId: 'foo',
  tags: [
    'foo',
    'bar'
  ]
};

function insertEvent(event, callback) {
  dataset.save({
    key: dataset.key([KIND]),
    data: event
  }, callback)

}

insertEvent(sampleEvent, console.log);

//listAllEvents(console.log)

module.exports = {
  listAllEvents: listAllEvents
};