require('lazy-ass');
var check = require('check-more-types');
var Github = require('github-api');
var R = require('ramda');
var status = require('http-status');
var Promise = require('bluebird');

function github(req) {
  var token = R.find(R.propEq('kind', 'github'), req.user.tokens);
  la(check.object(token), 'cannot find gh token', req.user.tokens);
  la(check.unemptyString(token.accessToken), 'expected access token in', token);
  return new Github({ token: token.accessToken });
}

// GET /repos
exports.getRepos = function(req, res, next) {
  var gh = github(req);
  var user = gh.getUser();
  var repos = Promise.promisify(user.repos, user);

  repos()
    .then(function (repos) {
      res.render('review/repos', {
        title: 'Repos',
        repos: repos
      });
    })
    .catch(next);
};

// GET /repos/<user>/<name>
exports.getRepo = function(req, res, next) {

  var user = req.params.user;
  if (!user) {
    return res.status(status.BAD_REQUEST).send('Missing user name');
  }

  var name = req.params.name;
  if (!name) {
    return res.status(status.BAD_REQUEST).send('Missing repo name');
  }

  var gh = github(req);
  var repo = gh.getRepo(user, name);
  // two promises
  var show = Promise.promisify(repo.show, repo)();
  var getTree = Promise.promisify(repo.getTree, repo)('master?recursive=true');
  var promises = [show, getTree];
  Promise.all(promises)
    .spread(function (info, tree) {
      var filesOnly = R.filter(R.propEq('type', 'blob'), tree);

      res.render('review/repo', {
        title: 'Repo',
        repo: check.array(info) ? info[0] : info,
        fileList: filesOnly
      });
    })
    .catch(next);
};
