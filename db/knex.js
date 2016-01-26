/**
 * Created by crimmings on 1/24/16.
 */
"use strict";
/*


 Bookshelf library initialized by passing an initialized Knex client instance.
 Initialization should only happen once in app.
 */

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: '',
    password: '',
    database: 'unionparkmktg',
    debug: true
  }
});

//

// createTable : creates a new table on the database with a callback to modify table's structure using schema-building commands.
// creates table for CUES after checking to see if CUES exists
knex.schema.hasTable('cues').then(function (exists) {

  if (!exists) {
    knex.schema.createTable('cues', function (cue) {
      // source id for google calendar event as  string
      cue.increments('id').primary(); // id
      cue.string('google_id'); // id tied to google calendar events
      cue.string('name'); // creates column for 'name' w/ type string.
      cue.enu('status', ['Committed', 'Pending', 'Deleted']); // creates column for status w/ enumeration for committed/pending/deleted
      cue.date('start_date'); // creates column for start_date with type date.
      cue.date('end_date'); // creates column for end_date with type date.
      cue.string('description'); // creates column for description with type string.
    }).then(function (table) {
      console.log('Created cues table', table);
    });

  }
});


// creates table for TAGS
knex.schema.hasTable('tags').then(function (exists) {
  if (!exists) {
    knex.schema.createTable('tags', function (tag) {
      "use strict";
      tag.increments('id').primary(); // id
      tag.string('tag_name'); // creates column for "tag name" w/ type string.
      tag.integer('cue_id'); // creates column for "cue_id" with type integer.
    }).then(function (table) {
      console.log('Created tags table', table);
    });
  }
});

// creates table for CALENDARS
knex.schema.hasTable('calendars').then(function (exists) {
  if (!exists) {
    knex.schema.createTable('calendars', function (calendar) {
      calendar.increments('id').primary(); // id
      calendar.string('calendar_name'); // creates column for "calendar name" with type string
      calendar.integer('tag_id'); // creates column for 'tag_id" with type integer.
    }).then(function (table) {
      console.log('Created calendar table', table);
    });
  }
});

module.exports = knex;