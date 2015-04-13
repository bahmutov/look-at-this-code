var Github = require('github-api');
var R = require('ramda');

// GET /review/repos
exports.getReviewRepos = function(req, res, next) {
  var token = R.find(R.propEq('kind', 'github'), req.user.tokens);
  console.log('found github token', token);

  var github = new Github({ token: token.accessToken });
  var repo = github.getRepo('sahat', 'requirejs-library');
  repo.show(function(err, repo) {
    if (err) return next(err);
    res.render('review/repos', {
      title: 'Repos',
      repo: repo
    });
  });

};
