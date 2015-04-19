var crypto = require('crypto');
require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');

function createNoteStore(pouchDb) {
  la(pouchDb, 'expected pouch db');
  la(check.fn(pouchDb.store), 'missing pouch store function, use store.pouchdb');
  var Note = pouchDb.store();
  return Note;
}

module.exports = R.once(createNoteStore);
