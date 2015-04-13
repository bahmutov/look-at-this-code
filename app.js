/**
 * API keys and Passport configuration.
 */
var config = require('./config');

(function connectToDb() {
  var PouchDb = require('pouchdb');
  PouchDb.plugin(require('store.pouchdb'));
  var pouch = new PouchDb(config.get('db'));
  require('./models/init-models')(pouch);
}());

var app = require('./config/server');
require('./config/routes')(app);
var errorHandler = require('errorhandler');
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
