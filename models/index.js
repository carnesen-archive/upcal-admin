// created by crimmings 1/23
// playing around with knex/bookshelf

/*
var knex = require('knex')({
client: 'pg'
connection: {
host: 'localhost',
user: '',
password: '',
database: 'unionpark'
}
});

var bookshelf = require('bookshelf')(knex);

schema.js?
var Schema = {
    consumercues: {
        id: {type: "increments", nullable: false, primary: true},
        name: {type: "string", maxlength: 50, nullable: false, unique: true},
        status: {look up what we need here},
        start_date: {type: "date", nullable: false},
        end_date: {type: "date", nullable: false},
        description: {type: "string", maxlength: 200, nullable: false}
        };

    tags: {
        id: {type: 'increments', nullable: false, primary: true},
        name: {type: 'string', maxlength: 30, nullable: false}
        }

     calendars: {
        id: {type: 'increments', nullable: false, primary: true},
        name: {type: 'string', maxlength: 30, nullable: false}
        }


    // a table for many-to-many relation between tags table & consumer cues
    cues_tags: {
    id: {type: 'increments', nullable: false, primary: true},
    cue_id: {type: 'integer', nullable: false, unsigned: true, reference: 'consumercues.id'}, // check this
    tag_id: {type: "integer", nullable: false, unsigned: true, references: "tags.id"}
    }

}//end of schema

module.exports = Schema;

 */