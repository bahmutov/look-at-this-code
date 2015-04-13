var config = require('./');

/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');
var lusca = require('lusca');
var methodOverride = require('method-override');
var multer  = require('multer');

var flash = require('express-flash');
var toFull = require('path').join.bind(null, __dirname);
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
app.set('port', config.get('PORT'));
app.set('env', config.get('NODE_ENV') || 'dev');
app.set('views', toFull('../views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
  paths: [toFull('../public/css'), toFull('../public/js')]
}));
app.use(logger(config.get('NODE_ENV')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: toFull('../uploads') }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.get('sessionSecret'),
  store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
app.use(express.static(toFull('../public'), { maxAge: 31557600000 }));
module.exports = app;
