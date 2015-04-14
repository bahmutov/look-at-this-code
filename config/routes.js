var passportConf = require('./passport');
var passport = require('passport');
var S = require('spots');

/**
 * Controllers (route handlers).
 */
var homeController = require('../controllers/home');
var userController = require('../controllers/user');
var ghController = require('../controllers/gh');
var contactController = require('../controllers/contact');

function addRoutes(app) {
  /**
   * Primary app routes.
   */
  app.get('/', homeController.index);
  app.get('/login', userController.getLogin);
  app.post('/login', userController.postLogin);
  app.get('/logout', userController.logout);
  app.get('/contact', contactController.getContact);
  app.post('/contact', contactController.postContact);
  app.get('/account', passportConf.isAuthenticated, userController.getAccount);
  app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
  app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

  // code review routes
  var authGet = S(app.get, S, passportConf.isAuthenticated, passportConf.isAuthorized).bind(app);
  authGet('/repos', ghController.getRepos);
  authGet('/repos/:user/:name', ghController.getRepo);
  authGet('/repos/view/:user/:name/:file', ghController.viewFile);

  // auth via github
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    console.log('logged in via github');
    res.redirect(req.session.returnTo || '/');
  });
}

module.exports = addRoutes;
