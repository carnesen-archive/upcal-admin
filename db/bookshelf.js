/**
 * Created by crimmings on 1/24/16.
 */

/*

Bookshelf library initiliazed by passing an initialized Knex client instance.
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

var db = require('bookshelf')(knex);

// createTable : creates a new table on the database with a callback to modify table's structure using schema-building commands.
// creates table for CUES after checking to see if CUES exists
db.knex.schema.hasTable('cues').then(function(exists){
    "use strict";
    if(!exists){
        db.knex.schema.createTable('cues', function(cue){
            "use strict";
            cue.increments('id').primary(); // id
            cue.string('name'); // creates column for 'name' w/ type string.
            cue.enu('status', ['Committed', 'Pending','Deleted']); // creates column for status w/ enumeration for committed/pending/deleted
            cue.date('start_date'); // creates column for start_date with type date.
            cue.date('end_date'); // creates column for end_date with type date.
            cue.string('description'); // creates column for description with type string.
        }).then(function(table){
            console.log('Created cues table', table);
        });

    }
});

// creates table for TAGS
db.knex.schema.hasTable('tags').then(function(exists){
    "use strict";
    if(!exists){
        db.knex.schema.createTable('tags', function(tag){
            "use strict";
            tag.increments('id').primary(); // id
            tag.string('tag_name'); // creates column for "tag name" w/ type string.
            tag.integer('cue_id'); // creates column for "cue_id" with type integer.
        }).then(function(table){
            console.log('Created tags table', table);
        });
    }
});

// creates table for CALENDARS
db.knex.schema.hasTable('calendars').then(function(exists){
    "use strict";
    if(!exists){
        db.knex.schema.createTable('calendars', function(calendar){
            calendar.increments('id').primary(); // id
            calendar.string('calendar_name'); // creates column for "calendar name" with type string
            calendar.integer('tag_id'); // creates column for 'tag_id" with type integer.
        }).then(function(table){
            console.log('Created calendar table', table);
        });
    }
});

module.exports = db;