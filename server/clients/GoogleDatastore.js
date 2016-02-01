'use strict';

// installed modules
var gcloud = require('gcloud');

// local modules
var C = require('../Constants');

/*
 In Google Cloud Datastore, a "dataset" is like a "database" in an RDBMS.
 Within a dataset a "kind" is like a "table" in an RDBMS.
 An "entity" is the equivalent of a row in an RDBMS or a "document" in MongoDB.
 The unique key identifying each entity is called a "key".
 The data fields stored in each entity are called "properties".
 https://cloud.google.com/datastore/docs/concepts/overview?hl=en
 */
var dataset = gcloud.datastore.dataset(C.gcloud);

// We'll just use a single kind, "Event"
var KIND = 'Event';

function key(calendarId, eventId) {
  return dataset.key([KIND, calendarId + ' ' + eventId]);
}

/**
 * Returns an error all entities of kind KIND
 * @param callback : function of err, entities
 */
function listAllEvents(callback) {

  // To get data out of the dataset using gcloud, one first creates a query then runs it
  // give us every event because "kind" is equal to "event"
  var q = dataset.createQuery([KIND]);

  dataset.runQuery(q, function(err, entities) {
    if (err) {
      callback(err);
    }
    // if callback succeeds, put "null" as the value of the error and map the "entities" array
    // each element of "entities" is an object that has a key field and a data field, and we just want to return a data field
    callback(null, entities.map(function(entity) {
      return entity;
    }));
  });

}

/**
 * Inserts a single event into the datastore
 * @param event : data object to be inserted
 * @param done {function} [noop] : optional function called when the insertion has completed
 */
function insertEvent(event, done) {
  done = done || function() {};
  dataset.save({
    key: dataset.key([KIND, event.calendarId + event.eventId]),
    data: {
      eventId: event.eventId,
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

function updateEvent() {

}

//insertEvent(sampleEvent)
//listAllEvents(console.log)

module.exports = {
  updateEvent: updateEvent,
  listAllEvents: listAllEvents,
  insertEvent: insertEvent
};