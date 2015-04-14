var Github = require('github-api');
var R = require('ramda');
var status = require('http-status');

// GET /repos
exports.getRepos = function(req, res, next) {
  var token = R.find(R.propEq('kind', 'github'), req.user.tokens);

  var github = new Github({ token: token.accessToken });
  var user = github.getUser();
  user.repos(function (err, repos) {
    if (err) return next(err);

    res.render('review/repos', {
      title: 'Repos',
      repos: repos
    });
  });
};

// GET /repos/<user>/<name>
exports.getRepo = function(req, res, next) {
  var token = R.find(R.propEq('kind', 'github'), req.user.tokens);

  var user = req.params.user;
  if (!user) {
    return res.status(status.BAD_REQUEST).send('Missing user name');
  }

  var name = req.params.name;
  if (!name) {
    return res.status(status.BAD_REQUEST).send('Missing repo name');
  }
  var github = new Github({ token: token.accessToken });
  var repo = github.getRepo(user, name);

  repo.show(function (err, info) {
    if (err) return next(err);

    res.render('review/repo', {
      title: 'Repo',
      repo: info
    });
  });

};
