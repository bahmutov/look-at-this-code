var R = require('ramda');

function initModels(db) {
  return {
    User: require('./User')(db),
    Note: require('./Note')(db)
  };
};

module.exports = R.once(initModels);
