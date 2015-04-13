var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
// var mongoose = require('mongoose');
require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');

// Helper method for getting user's gravatar.
function userGravatar(size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

function createUserStore(pouchDb) {
  la(pouchDb, 'expected pouch db');
  la(check.fn(pouchDb.store), 'missing pouch store function, use store.pouchdb');
  var User = pouchDb.store();

  User.gravatar = userGravatar;

  return User;
}

module.exports = R.once(createUserStore);
