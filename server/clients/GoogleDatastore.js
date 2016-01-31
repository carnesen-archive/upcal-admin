'use strict';

// installed modules
var gcloud = require('gcloud');

// local modules
var C = require('../Constants');

/*
 In Google Cloud Datastore, a datastore is like a "database" in an RDBMS.
 Within a "dataset" is like a "table" in an RDBMS.
 An "entity" is the equivalent of a row in an RDBMS or a "document" in MongoDB.
 The unique key identifying each entity is called a "key".
 The data fields stored in each entity are called "properties".
 https://cloud.google.com/datastore/docs/concepts/overview?hl=en
 */
var dataset = gcloud.datastore.dataset(C.gcloud);

// We'll just use a single kind, "Event"
var KIND = 'Event';

/**
 * Returns an error all entities of kind KIND
 * @param callback : function of err, entities
 */
function listAllEvents(callback) {

  // To get data out of the dataset using gcloud, one first creates a query then runs it
  var q = dataset.createQuery([KIND]);

  dataset.runQuery(q, function(err, entities) {
    if (err) {
      callback(err);
    }
    callback(null, entities.map(function(entity) {
      return entity.data;
    }));
  });

}

/**
 * Inserts a single event into the datastore
 * @param event : data object to be inserted
 * @param done : optional function called when the insertion has completed
 */
function insertEvent(event, done) {
  done = done || function() {};
  dataset.save({
    key: dataset.key([KIND]),
    data: {
      eventId: event.id,
      calendarId: event.calendarId,
      tags: event.tags
    }
  }, done)
}

/**
 * For development only! Deletes all entities of kind KIND
 * @param done : optional function called when the deletion is
 */
function deleteAll(done) {
  done = done || function() {};
  var q = dataset.createQuery([KIND]);
  dataset.runQuery(q, function(err, entities) {
    var keys = entities.map(function(entity) {
      return entity.key
    });
    dataset.delete(keys, done);
  });
}

//listAllEvents(console.log)
//deleteAll(console.log)

module.exports = {
  listAllEvents: listAllEvents,
  insertEvent: insertEvent
};